import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FileText, Sparkles, Zap, Copy as CopyIcon, FileDown } from 'lucide-react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const PdfSummaryPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [followupsLoading, setFollowupsLoading] = useState(false);
  const [followupsError, setFollowupsError] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary('');
    setError('');
    setQuestions([]);
    setFollowupsError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setSummary('');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSummary('');
    setError('');
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/pdf-summary', formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(res.data.summary);
      setHistoryRefresh(r => r + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize PDF.');
    }
    setLoading(false);
  };

  const fetchFollowups = async () => {
    setFollowupsError('');
    setFollowupsLoading(true);
    try {
      const res = await axios.post('/api/pdf-followups', { summary }, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      setQuestions((res.data && res.data.questions) || []);
    } catch (err) {
      setFollowupsError(err.response?.data?.error || 'Failed to fetch follow-up questions.');
    }
    setFollowupsLoading(false);
  };

  // --- Export & Copy Functions ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${summary}`);
    alert('Copied to clipboard!');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Summary:', 10, 10);
    doc.text(summary, 10, 20);
    doc.save(`PDF_Summary.pdf`);
  };

  const exportDOCX = () => {
    const content = `Summary:\n${summary}`;
    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(blob, `PDF_Summary.docx`);
  };

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: '4s'
            }}
          ></div>
        ))}
      </div>

      <div className="flex min-h-screen relative z-10">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">PDF Summarizer</h2>
              <p className="text-slate-300 text-lg">
                Upload a PDF and get an AI-generated summary
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-700/50">
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                    dragActive
                      ? 'border-purple-400 bg-purple-500/10'
                      : file
                      ? 'border-emerald-400 bg-emerald-500/10'
                      : 'border-slate-600 hover:border-purple-400/50 hover:bg-slate-700/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {/* File display + Sparkles (unchanged) */}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                  
                {/* Action Button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Summarizing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Zap className="w-5 h-5" />
                        <span>Summarize PDF</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Result */}
              {error && (
                <div className="p-8">
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {summary && (
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <span>Summary</span>
                  </h3>
                  <div className="bg-slate-700/50 border border-teal-400/30 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-white font-medium whitespace-pre-wrap">{summary}</p>
                  </div>

                  {/* --- Export & Copy Buttons --- */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={copyToClipboard}
                      title="Copy"
                      className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={exportPDF}
                      title="Export PDF"
                      className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={exportDOCX}
                      title="Export DOCX"
                      className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Follow-up section */}
                  <div className="mt-8 space-y-4">
                    <button
                      onClick={fetchFollowups}
                      disabled={followupsLoading}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                      {followupsLoading ? 'Generating…' : 'Show Follow-up Questions'}
                    </button>

                    {followupsError && (
                      <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 text-red-300 text-sm">
                        {followupsError}
                      </div>
                    )}

                    {questions.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4 md:col-span-2">
                          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" /> Follow-up Questions
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-200">
                            {questions.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfSummaryPage;
  