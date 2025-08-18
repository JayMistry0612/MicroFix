import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import SidebarHistory from "../components/SidebarHistory";
import axios from "axios";
import { Sparkles, Zap, FileText } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 p-6">
          <SidebarHistory feature="tone" refresh={historyRefresh} />
        </div>

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
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 text-center">
                <Zap className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">AI Powered</p>
                <p className="text-slate-400 text-xs">Advanced rewriting</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 text-center">
                <FileText className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Any Tone</p>
                <p className="text-slate-400 text-xs">Formal, Friendly, Sarcastic...</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 text-center">
                <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Stylish UI</p>
                <p className="text-slate-400 text-xs">Glassmorphic & Animated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToneChangerPage;
