import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { History as HistoryIcon, Sparkles, Filter } from 'lucide-react';

const featureTitles = {
  all: 'All Features',
  pdf: 'PDF Summaries',
  image: 'Image Captions',
  audio: 'Audio Analyses',
  tone: 'Tone Changes',
};

const features = ['all', 'pdf', 'image', 'audio', 'tone'];

const HistoryPage = () => {
  const { getToken } = useContext(AuthContext);
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async (feature) => {
    setLoading(true);
    setError('');
    try {
      let url = '/api/history';
      if (feature !== 'all') url += `/${feature}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setHistory(res.data.history || []);
    } catch (err) {
      setError('Failed to load history.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory(selectedFeature);
  }, [selectedFeature]);

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      {/* Animated Background */}
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

      {/* Main Content */}
      <div className="flex min-h-screen relative z-10">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-5xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
                <HistoryIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">Your History</h2>
              <p className="text-slate-300 text-lg">Review your past activity by feature</p>
            </div>

            {/* Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="p-8">
                {/* Filter pills */}
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-slate-300" />
                    {features.map((feat) => (
                      <button
                        key={feat}
                        onClick={() => setSelectedFeature(feat)}
                        className={`px-3 py-1.5 rounded-full text-sm transition border ${
                          selectedFeature === feat
                            ? 'bg-purple-500/80 text-white border-purple-400/50'
                            : 'bg-slate-700/50 text-slate-200 border-slate-600/50 hover:bg-slate-700'
                        }`}
                      >
                        {featureTitles[feat]}
                      </button>
                    ))}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {history.length} record{history.length === 1 ? '' : 's'}
                  </div>
                </div>

                {/* Content */}
                {loading && (
                  <ul className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <li key={i} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
                        <div className="h-4 w-32 bg-slate-600/50 rounded mb-3 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="h-20 bg-slate-600/30 rounded animate-pulse"></div>
                          <div className="h-20 bg-slate-600/30 rounded animate-pulse"></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {error && <div className="text-red-400">{error}</div>}
                {!loading && !error && history.length === 0 && (
                  <div className="text-slate-400">No history yet.</div>
                )}

                <ul className="space-y-4">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 text-sm text-slate-200 transition hover:bg-slate-700/60 hover:border-slate-500/60"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {featureTitles[item.feature] || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="font-semibold text-slate-100">Input</p>
                          <pre className="whitespace-pre-wrap bg-slate-800/70 border border-slate-600/50 p-2 rounded mt-1">{item.original_input || 'N/A'}</pre>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">Output</p>
                          <pre className="whitespace-pre-wrap bg-slate-800/70 border border-slate-600/50 p-2 rounded mt-1">{item.ai_response || 'N/A'}</pre>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
