import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import SidebarHistory from '../components/SidebarHistory';
import axios from 'axios';

const AudioMoodPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [mood, setMood] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscript('');
    setMood('');
    setError('');
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
    <div style={{ display: 'flex', minHeight: 500 }}>
      <SidebarHistory feature="audio" refresh={historyRefresh} />
      <div style={{ flex: 1, maxWidth: 600, margin: '2rem auto', padding: 24 }}>
        <h2>Audio-to-Text & Mood Analysis</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
            {loading ? 'Analyzing...' : 'Analyze Audio'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        {transcript && (
          <div style={{ marginTop: 24 }}>
            <h3>Transcript:</h3>
            <div style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{transcript}</div>
          </div>
        )}
        {mood && (
          <div style={{ marginTop: 16 }}>
            <h3>Mood/Sentiment:</h3>
            <div style={{ background: '#f0f7f0', padding: 12 }}>{mood}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioMoodPage; 