import React, { useState } from 'react';

function TextToneChanger({ apiUrl }) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('formal');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data.transformed_text);
    } catch (err) {
      setError('Failed to change tone.');
    }
    setLoading(false);
  };

  return (
    <section>
      <h2>2. Text Tone Changer</h2>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." rows={3} style={{ width: '100%' }} />
        <select value={tone} onChange={e => setTone(e.target.value)}>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="assertive">Assertive</option>
        </select>
        <button type="submit" disabled={loading || !text}>Change Tone</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {result && <p><b>Result:</b> {result}</p>}
    </section>
  );
}

export default TextToneChanger; 