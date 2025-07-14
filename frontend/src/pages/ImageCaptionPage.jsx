import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import SidebarHistory from '../components/SidebarHistory';
import axios from 'axios';

const ImageCaptionPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCaption('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaption('');
    setError('');
    if (!file) {
      setError('Please select an image file.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/image-caption', formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setCaption(res.data.caption);
      setHistoryRefresh(r => r + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to caption image.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: 500 }}>
      <SidebarHistory feature="image" refresh={historyRefresh} />
      <div style={{ flex: 1, maxWidth: 600, margin: '2rem auto', padding: 24 }}>
        <h2>Image Captioning</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
            {loading ? 'Captioning...' : 'Caption Image'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
        {caption && (
          <div style={{ marginTop: 24 }}>
            <h3>Caption:</h3>
            <div style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{caption}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCaptionPage; 