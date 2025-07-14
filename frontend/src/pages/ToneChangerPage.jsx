import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import SidebarHistory from '../components/SidebarHistory';
import axios from 'axios';

const TONES = [
  'formal',
  'informal',
  'sarcastic',
  'friendly',
  'professional',
  'excited',
  'sad',
  'angry',
  'neutral',
];

const ToneChangerPage = () => {
  const { getToken } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [tone, setTone] = useState('formal');
  const [rewritten, setRewritten] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRewritten('');
    setError('');
    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/tone-changer',
        { text, tone },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setRewritten(res.data.rewritten);
      setHistoryRefresh(r => r + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to rewrite text.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: 500 }}>
      <SidebarHistory feature="tone" refresh={historyRefresh} />
      <div style={{ flex: 1, maxWidth: 600, margin: '2rem auto', padding: 24 }}>
        <h2>Tone Changer</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              style={{ width: '100%' }}
              required
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)}>
              {TONES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Rewriting...' : 'Rewrite Text'}
          </button>
        </form>
        {rewritten && (
          <div style={{ marginTop: 24 }}>
            <h3>Rewritten Text:</h3>
            <div style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{rewritten}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToneChangerPage; 