import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Camera } from 'lucide-react';

const ImageCaptionPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [captionType, setCaptionType] = useState('description');

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
      formData.append('caption_type', captionType);

      const res = await axios.post('/api/image-caption', formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setCaption(res.data.caption);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to caption image.');
    }
    setLoading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setCaption('');
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      <div className="flex min-h-screen relative z-10">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
                <Camera className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">AI Image Captioning</h2>
              <p className="text-slate-300 text-lg">Upload an image and let AI describe what it sees</p>
            </div>

            {/* Main Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">

              {/* Upload Section */}
              <div className="p-8 border-b border-slate-700/50">

                {/* Caption Style Dropdown */}
                <div className="mb-6">
                  <label className="block text-slate-300 text-sm font-medium mb-3">
                    Choose Caption Style
                  </label>
                  <div className="relative">
                    <select
                      value={captionType}
                      onChange={(e) => setCaptionType(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-600 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200"
                    >
                      <option value="description">📝 Description</option>
                      <option value="instagram_post">📸 Instagram Post</option>
                      <option value="instagram_story">✨ Instagram Story</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Pick how you want your caption styled
                  </p>
                </div>

                {/* Drag & Drop Upload Box */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                    dragActive
                      ? 'border-purple-400 bg-purple-500/10'
                      : file
                      ? 'border-emerald-400 bg-emerald-500/10'
                      : 'border-slate-600 hover:border-purple-400/50 hover:bg-slate-700/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center relative z-10">
                    {file ? (
                      <div className="space-y-2">
                        <p className="text-emerald-400 font-semibold">✓ File Selected</p>
                        <p className="text-slate-300 text-sm">{file.name}</p>
                        <div className="flex justify-center mt-4">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="max-w-48 max-h-48 rounded-lg border border-emerald-400/30 shadow-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-white font-semibold text-lg">Drop your image here</p>
                        <p className="text-slate-400">or click to browse files</p>
                        <p className="text-slate-500 text-sm">Supports JPG, PNG, GIF, WebP</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? "Analyzing image..." : "Generate Caption"}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="p-8">
                {error && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 mb-6">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}
                {caption && (
                  <div className="bg-slate-700/50 border border-teal-400/30 rounded-xl p-6 max-h-72 overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-3">AI Generated Caption</h3>
                    <p className="text-white text-lg leading-relaxed font-medium break-words whitespace-pre-wrap">
                      {caption}
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCaptionPage;
