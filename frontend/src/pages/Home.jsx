import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image, Volume2, Music, ArrowRight, Sparkles, Zap, Brain, Activity } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    { id: 'pdf', title: 'PDF Summarizing', description: 'Transform lengthy documents into concise, intelligent summaries with AI-powered analysis', icon: FileText, color: 'emerald', bgPattern: 'from-emerald-500/10 to-green-500/5', borderColor: 'border-emerald-400/30', iconBg: 'bg-emerald-500/20', features: ['Smart extraction', 'Key points', 'Quick insights'], route: '/pdf' },
    { id: 'image', title: 'Image Caption', description: 'Generate detailed, contextual descriptions for any image using advanced computer vision', icon: Image, color: 'cyan', bgPattern: 'from-cyan-500/10 to-blue-500/5', borderColor: 'border-cyan-400/30', iconBg: 'bg-cyan-500/20', features: ['Object detection', 'Scene analysis', 'Rich descriptions'], route: '/image' },
    { id: 'tone', title: 'Tone Changer', description: 'Modify the emotional tone and style of your text to match any desired mood or audience', icon: Volume2, color: 'purple', bgPattern: 'from-purple-500/10 to-violet-500/5', borderColor: 'border-purple-400/30', iconBg: 'bg-purple-500/20', features: ['Style adaptation', 'Mood shifting', 'Audience targeting'], route: '/tone' },
    { id: 'audio', title: 'Audio Description & Mood', description: 'Analyze audio files to extract emotional context, themes, and detailed descriptions', icon: Music, color: 'rose', bgPattern: 'from-rose-500/10 to-pink-500/5', borderColor: 'border-rose-400/30', iconBg: 'bg-rose-500/20', features: ['Mood detection', 'Audio analysis', 'Emotional insights'], route: '/audio' },
  ];

  const colorClasses = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-400/30', tagBg: 'bg-emerald-500/20', tagBorder: 'border-emerald-400/30', tagText: 'text-emerald-300', hoverBg: 'bg-emerald-500/30', hoverGlow: 'bg-emerald-500/5' },
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-400/30', tagBg: 'bg-cyan-500/20', tagBorder: 'border-cyan-400/30', tagText: 'text-cyan-300', hoverBg: 'bg-cyan-500/30', hoverGlow: 'bg-cyan-500/5' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-400/30', tagBg: 'bg-purple-500/20', tagBorder: 'border-purple-400/30', tagText: 'text-purple-300', hoverBg: 'bg-purple-500/30', hoverGlow: 'bg-purple-500/5' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-400/30', tagBg: 'bg-rose-500/20', tagBorder: 'border-rose-400/30', tagText: 'text-rose-300', hoverBg: 'bg-rose-500/30', hoverGlow: 'bg-rose-500/5' }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl border border-purple-400/30 flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">AI Studio</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-cyan-500 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-cyan-400 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Feature Cards */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(feature => {
            const Icon = feature.icon;
            const classes = colorClasses[feature.color];
            return (
              <div key={feature.id} onMouseEnter={() => setHoveredCard(feature.id)} onMouseLeave={() => setHoveredCard(null)}
                className={`group relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border ${feature.borderColor} shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 cursor-pointer`}
              >
                {/* Card Content */}
                <div className={`relative z-10 p-8`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${classes.bg} rounded-2xl border ${feature.borderColor} mb-6 backdrop-blur-sm transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={classes.text} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 text-base leading-relaxed mb-6">{feature.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {feature.features.map((item, i) => (
                      <span key={i} className={`${classes.tagBg} ${classes.tagBorder} ${classes.tagText} px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm`}>{item}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(feature.route)}
                    className={`${classes.tagBg} ${classes.tagBorder} ${classes.tagText} w-full py-3 px-4 rounded-xl font-semibold hover:${classes.hoverBg} hover:${classes.tagBorder} flex items-center justify-center space-x-2`}
                  >
                    <span>Try {feature.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
