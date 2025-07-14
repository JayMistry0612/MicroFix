import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import SidebarHistory from '../components/SidebarHistory';
import axios from 'axios';

const PdfSummaryPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary('');
    setError('');
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

  return (
    <div style={{ display: 'flex', minHeight: 500 }}>
      <SidebarHistory feature="pdf" refresh={historyRefresh} />
      <div style={{ flex: 1, maxWidth: 600, margin: '2rem auto', padding: 24 }}>
        <h2>PDF Summarizer</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
            {loading ? 'Summarizing...' : 'Summarize PDF'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        {summary && (
          <div style={{ marginTop: 24 }}>
            <h3>Summary:</h3>
            <div style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{summary}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSummaryPage; 