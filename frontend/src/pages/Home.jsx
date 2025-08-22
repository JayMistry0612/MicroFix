import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden pt-6 md:pt-10">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-400/20 rounded-lg rotate-12 animate-spin [animation-duration:15s]"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-teal-400/20 rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-rose-400/10 rounded-lg animate-bounce [animation-delay:1s]"></div>
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

      {/* Header removed to avoid duplicate branding with Navbar */}

      {/* Hero */}
      <section className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto text-center mb-4 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-400/30 mb-4 backdrop-blur-sm">
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Supercharge your content workflows</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">Summarize PDFs, caption images, analyze audio mood, and transform tone — all in one sleek workspace.</p>
        </div>
      </section>

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
