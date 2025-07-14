import React, { useState } from 'react';

function PdfSummarizer({ apiUrl }) {
  const [pdf, setPdf] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const formData = new FormData();
      formData.append('pdf', pdf);
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSummary(data.summary);
    } catch (err) {
      setError('Failed to summarize PDF.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setPdf(null);
    setSummary('');
    setError('');
  };

  return (
    <section>
      <h2>3. PDF Summarizer</h2>
      <form onSubmit={handleSubmit}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <input type="file" accept="application/pdf" onChange={e => setPdf(e.target.files[0])} />
          {pdf && <span className="file-preview">{pdf.name}</span>}
          {pdf && <button type="button" onClick={handleClear}>Clear</button>}
        </div>
        <button type="submit" disabled={loading || !pdf}>Summarize PDF</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {summary && <p><b>Summary:</b> {summary}</p>}
    </section>
  );
}

export default PdfSummarizer; 