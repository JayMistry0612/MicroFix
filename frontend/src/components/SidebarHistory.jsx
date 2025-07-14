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
            'Authorization': `Bearer ${getToken()}`,
          },
        });
        setHistory(res.data.history);
      } catch (err) {
        setError('Failed to load history.');
      }
      setLoading(false);
    };
    fetchHistory();
    // eslint-disable-next-line
  }, [feature, refresh]);

  return (
    <aside style={{ width: 280, borderRight: '1px solid #eee', padding: 16, minHeight: 400 }}>
      <h3 style={{ marginTop: 0 }}>{featureTitles[feature] || 'History'}</h3>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && history.length === 0 && <div>No history yet.</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map(item => (
          <li key={item.id} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
            <div style={{ fontSize: 12, color: '#888' }}>{new Date(item.created_at).toLocaleString()}</div>
            <div style={{ fontWeight: 500, marginTop: 4 }}>Input:</div>
            <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{item.original_input?.slice(0, 100)}</div>
            <div style={{ fontWeight: 500, marginTop: 4 }}>Output:</div>
            <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{typeof item.ai_response === 'string' ? item.ai_response.slice(0, 200) : JSON.stringify(item.ai_response)}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarHistory; 