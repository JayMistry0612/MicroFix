import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const featureTitles = {
  pdf: 'PDF Summaries',
  image: 'Image Captions',
  audio: 'Audio Analyses',
  tone: 'Tone Changes',
};

const SidebarHistory = ({ feature, refresh }) => {
  const { getToken } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/history/${feature}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setHistory(res.data.history);
      } catch (err) {
        setError('Failed to load history.');
      }
      setLoading(false);
    };
    fetchHistory();
  }, [feature, refresh, getToken]);

  return (
    <aside className="flex flex-col h-full min-h-screen">
      <h3 className="text-white text-lg font-bold mb-4">{featureTitles[feature] || 'History'}</h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {loading && <div className="text-slate-300">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && history.length === 0 && (
          <div className="text-slate-400">No history yet.</div>
        )}

        <ul className="space-y-1">
          {history.map((item) => (
            <li
              key={item.id}
              className="bg-slate-700/50 p-2 rounded-lg border border-slate-600/50 text-sm text-slate-200 truncate"
              title={item.original_input || item.ai_response}
            >
              {/* Show only the title or first 20-30 chars */}
              {item.original_input
                ? item.original_input.length > 30
                  ? item.original_input.slice(0, 30) + '...'
                  : item.original_input
                : item.ai_response
                ? item.ai_response.length > 30
                  ? item.ai_response.slice(0, 30) + '...'
                  : item.ai_response
                : 'Untitled'}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarHistory;
