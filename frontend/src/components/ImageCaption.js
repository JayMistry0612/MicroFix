import React, { useState } from 'react';

function ImageCaption({ apiUrl }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCaption('');
    try {
      const formData = new FormData();
      formData.append('image', image);
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setCaption(data.caption);
    } catch (err) {
      setError('Failed to generate caption.');
    }
    setLoading(false);
  };

  return (
    <section>
      <h2>1. Image Caption Generator</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <button type="submit" disabled={loading || !image}>Generate Caption</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {caption && <p><b>Caption:</b> {caption}</p>}
    </section>
  );
}

export default ImageCaption; 