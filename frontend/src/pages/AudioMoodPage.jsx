import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FileAudio, Sparkles, Zap } from 'lucide-react';

const AudioMoodPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [mood, setMood] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscript('');
    setMood('');
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setTranscript('');
      setMood('');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTranscript('');
    setMood('');
    setError('');
    if (!file) {
      setError('Please select an audio file.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/audio-analysis', formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setTranscript(res.data.transcript);
      setMood(res.data.mood);
      setHistoryRefresh(r => r + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze audio.');
    }
    setLoading(false);
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
        

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
                <FileAudio className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Audio-to-Text & Mood</h2>
              <p className="text-slate-300 text-lg">
                Upload an audio file and let AI transcribe and analyze its mood
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
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles
                        key={i}
                        className="absolute w-4 h-4 text-purple-400/40 animate-pulse"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${20 + (i % 2) * 40}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center relative z-10">
                    <div className="mb-4">
                      {file ? (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                          <FileAudio className="w-8 h-8 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-xl border border-purple-400/30">
                          <FileAudio className="w-8 h-8 text-purple-400" />
                        </div>
                      )}
                    </div>
                    {file ? (
                      <div className="space-y-2">
                        <p className="text-emerald-400 font-semibold">✓ File Selected</p>
                        <p className="text-slate-300 text-sm">{file.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-white font-semibold text-lg">Drop your audio here</p>
                        <p className="text-slate-400">or click to browse files</p>
                        <p className="text-slate-500 text-sm">Supports MP3, WAV, M4A</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
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
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Zap className="w-5 h-5" />
                        <span>Analyze Audio</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="p-8 space-y-4">
                {error && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}
                {transcript && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                      <FileAudio className="w-5 h-5 text-teal-400" />
                      <span>Transcript</span>
                    </h3>
                    <div className="bg-slate-700/50 border border-teal-400/30 rounded-xl p-6 backdrop-blur-sm">
                      <p className="text-white font-medium whitespace-pre-wrap">{transcript}</p>
                    </div>
                  </div>
                )}
                {mood && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-teal-400" />
                      <span>Mood / Sentiment</span>
                    </h3>
                    <div className="bg-slate-700/50 border border-teal-400/30 rounded-xl p-6 backdrop-blur-sm">
                      <p className="text-white font-medium">{mood}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioMoodPage;
