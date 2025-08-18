import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import SidebarHistory from '../components/SidebarHistory';
import axios from 'axios';
import { Upload, Image, Zap, FileImage, Sparkles, Camera, Menu, History } from 'lucide-react';

const ImageCaptionPage = () => {
  const { getToken } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [displayedCaption, setDisplayedCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  // Mock captions for demo
  const mockCaptions = [
    "A beautiful sunset over the mountains with vibrant orange and pink clouds reflecting in a calm lake below.",
    "A cute golden retriever sitting in a field of colorful wildflowers on a sunny day.",
    "A modern city skyline at night with illuminated skyscrapers reflecting in the water.",
    "A delicious chocolate cake with strawberries and cream on a wooden table.",
    "A person hiking on a mountain trail with a backpack, surrounded by pine trees and rocky terrain."
  ];

  // Typewriter effect for caption
  useEffect(() => {
    if (caption) {
      setDisplayedCaption('');
      let index = 0;
      const timer = setInterval(() => {
        if (index < caption.length) {
          setDisplayedCaption(prev => prev + caption.charAt(index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30); // Adjust speed here (lower = faster)
      
      return () => clearInterval(timer);
    }
  }, [caption]);

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
    try{
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
    }catch (err) {
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
      setDisplayedCaption('');
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-400/20 rounded-lg rotate-12 animate-spin [animation-duration:15s]"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-teal-400/20 rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-rose-400/10 rounded-lg animate-bounce [animation-delay:1s]"></div>
        
        {/* Floating dots */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: '4s'
            }}
          ></div>
        ))}
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Mock Sidebar */}
          <div className="w-64 bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/50 p-6">
            <SidebarHistory feature="image" refresh={historyRefresh} />
          </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
                <Camera className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">AI Image Captioning</h2>
              <p className="text-slate-300 text-lg">Upload an image and let AI describe what it sees</p>
            </div>

            {/* Main Content Card */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Upload Section */}
              <div className="p-8 border-b border-slate-700/50">
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
                  {/* Sparkle effects */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles
                        key={i}
                        className="absolute w-4 h-4 text-purple-400/40 animate-pulse"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${20 + (i % 2) * 40}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center relative z-10">
                    <div className="mb-4">
                      {file ? (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                          <FileImage className="w-8 h-8 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-xl border border-purple-400/30">
                          <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                      )}
                    </div>
                    
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
                    className="w-full bg-purple-500 text-white py-4 px-6 rounded-xl font-bold hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Analyzing image...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Zap className="w-5 h-5" />
                        <span>Generate Caption</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="p-8">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm animate-pulse mb-6">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Caption Output */}
                {(caption || displayedCaption) && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Image className="w-5 h-5 text-teal-400" />
                      <h3 className="text-xl font-bold text-white">AI Generated Caption</h3>
                    </div>
                    
                    <div className="bg-slate-700/50 border border-teal-400/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
                      {/* Animated border effect */}
                      <div className="absolute inset-0 bg-teal-400/5 animate-pulse"></div>
                      
                      <div className="relative z-10">
                        <p className="text-white text-lg leading-relaxed font-medium">
                          {displayedCaption}
                          {displayedCaption !== caption && (
                            <span className="inline-block w-1 h-6 bg-teal-400 ml-1 animate-pulse"></span>
                          )}
                        </p>
                      </div>
                      
                      {/* Floating sparkles in caption box */}
                      {displayedCaption && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <Sparkles
                              key={i}
                              className="absolute w-3 h-3 text-teal-400/30 animate-pulse"
                              style={{
                                right: `${10 + i * 15}%`,
                                top: `${20 + i * 20}%`,
                                animationDelay: `${i * 1}s`
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading Animation */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-200/20 border-t-purple-400 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-2 border-purple-300/20 border-b-purple-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-semibold">Processing your image...</p>
                      <p className="text-slate-400 text-sm mt-1">AI is analyzing the visual content</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 text-center">
                <Upload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Drag & Drop</p>
                <p className="text-slate-400 text-xs">Easy file upload</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 text-center">
                <Zap className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">AI Powered</p>
                <p className="text-slate-400 text-xs">Advanced recognition</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 text-center">
                <Image className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Any Format</p>
                <p className="text-slate-400 text-xs">JPG, PNG, GIF, WebP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCaptionPage;