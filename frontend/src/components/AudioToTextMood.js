import React, { useState } from 'react';

function AudioToTextMood({ apiUrl }) {
  const [audio, setAudio] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscription('');
    setMood('');
    try {
      const formData = new FormData();
      formData.append('audio', audio);
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setTranscription(data.transcription);
        setMood(data.mood);
      }
    } catch (err) {
      setError('Failed to transcribe audio or detect mood.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setAudio(null);
    setTranscription('');
    setMood('');
    setError('');
  };

  return (
    <section>
      <h2>4. Audio to Text + Mood Detection</h2>
      <form onSubmit={handleSubmit}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} />
          {audio && <span className="file-preview">{audio.name}</span>}
          {audio && <button type="button" onClick={handleClear}>Clear</button>}
        </div>
        <button type="submit" disabled={loading || !audio}>Transcribe & Detect Mood</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {transcription && <p><b>Transcription:</b> {transcription}</p>}
      {mood && <p><b>Mood:</b> {mood}</p>}
    </section>
  );
}

export default AudioToTextMood; 