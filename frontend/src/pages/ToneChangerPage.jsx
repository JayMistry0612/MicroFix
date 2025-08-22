import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Sparkles, Zap, FileText, Copy as CopyIcon, FileDown } from "lucide-react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const TONES = [
  "formal",
  "informal",
  "sarcastic",
  "friendly",
  "professional",
  "excited",
  "sad",
  "angry",
  "neutral",
];

const ToneChangerPage = () => {
  const { getToken } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [tone, setTone] = useState("formal");
  const [rewritten, setRewritten] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (rewritten) {
      setDisplayedText("");
      let index = 0;
      const timer = setInterval(() => {
        if (index < rewritten.length) {
          setDisplayedText((prev) => prev + rewritten.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [rewritten]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRewritten("");
    setError("");
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/tone-changer",
        { text, tone },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRewritten(res.data.rewritten);
      setHistoryRefresh((r) => r + 1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to rewrite text.");
    }
    setLoading(false);
  };

  // --- Export & Copy Functions ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${rewritten}`);
    alert("Copied to clipboard!");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Tone: ${tone}`, 10, 10);
    doc.text("Input:", 10, 20);
    doc.text(text, 10, 30);
    doc.text("Output:", 10, 50);
    doc.text(rewritten, 10, 60);
    doc.save(`ToneChanger.pdf`);
  };

  const exportDOCX = () => {
    const content = `Tone: ${tone}\n\nInput:\n${text}\n\nOutput:\n${rewritten}`;
    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(blob, `ToneChanger.docx`);
  };

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-400/20 rounded-lg rotate-12 animate-spin [animation-duration:15s]"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-teal-400/20 rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-rose-400/10 rounded-lg animate-bounce [animation-delay:1s]"></div>
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
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Tone Changer</h2>
              <p className="text-slate-300 text-lg">
                Rewrite your text in different tones powered by AI
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-700/50 space-y-4">
                <div className="flex flex-col">
                  <label className="text-slate-200 font-medium mb-1">Text</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="p-3 rounded-lg bg-slate-700/40 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Type your text here..."
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-slate-200 font-medium mb-1">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="p-2 rounded-lg bg-slate-700/40 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !text.trim()}
                  className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Rewriting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Zap className="w-5 h-5" />
                      <span>Rewrite Text</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Output Section */}
              {displayedText && (
                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <h3 className="text-xl font-bold text-white">AI Generated Text</h3>
                  </div>

                  <div className="bg-slate-700/50 border border-teal-400/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-white text-lg leading-relaxed font-medium">
                        {displayedText}
                        {displayedText !== rewritten && (
                          <span className="inline-block w-1 h-6 bg-teal-400 ml-1 animate-pulse"></span>
                        )}
                      </p>
                    </div>

                    {/* Floating sparkles */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <Sparkles
                          key={i}
                          className="absolute w-3 h-3 text-teal-400/30 animate-pulse"
                          style={{
                            right: `${10 + i * 15}%`,
                            top: `${20 + i * 20}%`,
                            animationDelay: `${i * 1}s`,
                          }}
                        />
                      ))}
                    </div>
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
                </div>
              )}
            </div>

            {/* Tips Section (unchanged) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToneChangerPage;
