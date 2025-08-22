import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image, Mic, Type, BarChart3, Sparkles, ArrowRight, Play, CheckCircle, Star, Users, Zap, Cpu, Brain, Eye, Wand2 } from 'lucide-react';

export default function MicrofixLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const [workingStates, setWorkingStates] = useState({
    0: { isProcessing: false, progress: 0, step: 0 },
    1: { isProcessing: false, progress: 0, step: 0 },
    2: { isProcessing: false, progress: 0, step: 0 },
    3: { isProcessing: false, progress: 0, step: 0 },
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize particles
    const particleArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(particleArray);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate AI processing workflow
  const startProcessing = (featureIndex) => {
    setWorkingStates(prev => ({
      ...prev,
      [featureIndex]: { isProcessing: true, progress: 0, step: 0 }
    }));

    // Simulate processing steps
    const steps = features[featureIndex].steps;
    let currentStep = 0;
    let progress = 0;

    const processInterval = setInterval(() => {
      progress += Math.random() * 25 + 10; // Random progress increments
      
      if (progress >= 100) {
        progress = 100;
        currentStep = steps.length - 1;
        
        setWorkingStates(prev => ({
          ...prev,
          [featureIndex]: { isProcessing: false, progress: 100, step: currentStep }
        }));
        
        clearInterval(processInterval);
        
        // Reset after showing complete state
        setTimeout(() => {
          setWorkingStates(prev => ({
            ...prev,
            [featureIndex]: { isProcessing: false, progress: 0, step: 0 }
          }));
        }, 2000);
        
      } else {
        currentStep = Math.min(Math.floor((progress / 100) * (steps.length - 1)), steps.length - 2);
        setWorkingStates(prev => ({
          ...prev,
          [featureIndex]: { isProcessing: true, progress, step: currentStep }
        }));
      }
    }, 400);
  };

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y,
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "PDF Summarization",
      description: "Transform lengthy documents into concise, actionable summaries with neural processing",
      color: "from-blue-500 via-cyan-500 to-teal-500",
      accentColor: "cyan",
      demo: "📄 → 🧠 → 📋",
      particles: "✨💫⭐",
      steps: ["Reading PDF...", "Analyzing content...", "Generating summary...", "Complete! ✅"],
      workingDemo: {
        input: "📄 150-page Research Paper",
        process: ["🔍 Scanning text", "🧠 AI Analysis", "✏️ Summarizing"],
        output: "📋 3-paragraph Summary"
      }
    },
    {
      icon: Image,
      title: "Image Caption Generator",
      description: "Generate compelling, contextual captions using advanced computer vision AI",
      color: "from-purple-500 via-pink-500 to-rose-500",
      accentColor: "purple",
      demo: "🖼️ → 👁️ → 📝",
      particles: "🎨🌈✨",
      steps: ["Loading image...", "Computer vision analysis...", "Generating caption...", "Caption ready! ✅"],
      workingDemo: {
        input: "🖼️ Landscape Photo",
        process: ["👁️ Vision scan", "🎯 Object detection", "✍️ Caption crafting"],
        output: "📝 Perfect Caption"
      }
    },
    {
      icon: Mic,
      title: "Voice Analysis & Mood",
      description: "Decode emotional patterns and sentiment from voice with precision audio AI",
      color: "from-green-500 via-emerald-500 to-teal-500",
      accentColor: "green",
      demo: "🎤 → 🎵 → 😊",
      particles: "🎵🎶💚",
      steps: ["Recording audio...", "Voice pattern analysis...", "Mood detection...", "Analysis complete! ✅"],
      workingDemo: {
        input: "🎤 Voice Recording",
        process: ["🔊 Audio processing", "📊 Pattern analysis", "🎭 Mood detection"],
        output: "😊 Happy (85% confidence)"
      }
    },
    {
      icon: Type,
      title: "Text Tone Transformer",
      description: "Intelligently adapt writing style and emotional tone for any context or audience",
      color: "from-orange-500 via-amber-500 to-yellow-500",
      accentColor: "orange",
      demo: "✍️ → 🎭 → ✨",
      particles: "📝🎯💛",
      steps: ["Analyzing text...", "Tone adjustment...", "Style transformation...", "Transformation complete! ✅"],
      workingDemo: {
        input: "✍️ Formal Text",
        process: ["📖 Style analysis", "🎭 Tone mapping", "✨ Transformation"],
        output: "💫 Casual & Friendly"
      }
    }
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, value: "99.9%", label: "Uptime", color: "from-green-500 to-emerald-500" },
    { icon: Star, value: "4.9/5", label: "Rating", color: "from-yellow-500 to-orange-500" },
    { icon: BarChart3, value: "1M+", label: "Documents Processed", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Particle Background */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* Dynamic Gradient Background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-purple-800/30 to-cyan-900/50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-0 right-1/3 w-88 h-88 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Interactive Cursor Glow */}
      <div 
        className="fixed w-64 h-64 pointer-events-none z-10 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      ></div>

      {/* Header */}
      <header className={`relative z-50 backdrop-blur-2xl bg-gradient-to-r from-black/20 via-purple-900/10 to-black/20 border-b border-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:shadow-cyan-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                Microfix
              </span>
              <div className="text-xs text-cyan-400 font-medium tracking-widest">AI POWERED</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Analytics', 'Pricing'].map((item, index) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="relative group py-2">
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                  {item}
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
              </a>
            ))}
            
            <button onClick={() => navigate('/login')} className="relative group px-8 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full font-semibold shadow-2xl shadow-purple-500/25 hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-110 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-24 pb-40">
        <div className={`text-center transition-all duration-1500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="relative inline-block mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 leading-none">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                AI-Powered
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                Content
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Revolution
              </span>
            </h1>
            
            {/* Floating Icons */}
            <div className="absolute -top-8 -left-8 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
              <Brain className="w-12 h-12 text-cyan-400 opacity-60" />
            </div>
            <div className="absolute -top-4 -right-12 animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}>
              <Cpu className="w-10 h-10 text-purple-400 opacity-60" />
            </div>
            <div className="absolute -bottom-8 left-8 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
              <Eye className="w-8 h-8 text-pink-400 opacity-60" />
            </div>
            <div className="absolute -bottom-4 -right-8 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
              <Wand2 className="w-10 h-10 text-orange-400 opacity-60" />
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Transform your <span className="text-cyan-400 font-medium">content workflow</span> with our suite of 
            <span className="text-purple-400 font-medium"> intelligent tools</span>. 
            <br className="hidden md:block" />
            Summarize PDFs, generate captions, analyze voice, and metamorphose text tones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button onClick={() => navigate('/login')} className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full text-xl font-bold shadow-2xl shadow-purple-500/40 hover:shadow-cyan-500/60 transition-all duration-700 hover:scale-110 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center space-x-3">
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </button>
            
            <button className="group relative flex items-center space-x-3 px-10 py-5 border-2 border-gray-600 hover:border-cyan-400 rounded-full transition-all duration-500 hover:scale-105 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
              <span className="text-xl font-semibold group-hover:text-cyan-300 transition-colors duration-300">Watch Demo</span>
            </button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10 group-hover:opacity-20 rounded-3xl blur transition-opacity duration-500`}></div>
                <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 group-hover:border-cyan-400/50 transition-all duration-500 hover:scale-110 hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 font-medium tracking-wide">{stat.label}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 via-transparent to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 rounded-3xl transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="relative z-10 py-32 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold tracking-wide">POWERFUL AI FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next-Gen Intelligence
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Experience the future of content processing with our 
              <span className="text-purple-400 font-medium"> cutting-edge AI tools</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              const workingState = workingStates[index];
              const isWorking = workingState.isProcessing || workingState.progress === 100;
              
              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-700 hover:scale-105 ${
                    isActive ? 'scale-105 z-20' : 'hover:z-10'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                  onClick={() => !workingState.isProcessing && startProcessing(index)}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-30 ${isActive ? 'opacity-20' : ''} ${isWorking ? 'opacity-40 animate-pulse' : ''} rounded-3xl blur-xl transition-opacity duration-700`}></div>
                  
                  {/* Card */}
                  <div className={`relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-2xl p-8 rounded-3xl border transition-all duration-700 overflow-hidden ${
                    isActive 
                      ? 'border-cyan-400/60 shadow-2xl shadow-cyan-500/25' 
                      : 'border-gray-700/50 group-hover:border-purple-500/60'
                  } ${isWorking ? 'border-green-400/60 shadow-2xl shadow-green-500/25' : ''}`}>
                    
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} ${isWorking ? 'animate-pulse' : ''}`}></div>
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>
                    
                    {/* Processing Indicator */}
                    {isWorking && (
                      <div className="absolute top-4 right-4 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        <div className="text-xs text-green-400 font-semibold">PROCESSING</div>
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} mb-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl ${isWorking ? 'animate-bounce' : ''}`}>
                      <Icon className="w-10 h-10 text-white" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-50 scale-110 ${isWorking ? 'animate-pulse' : ''}`}></div>
                      
                      {/* Processing Ring */}
                      {workingState.isProcessing && (
                        <div className="absolute inset-0 rounded-3xl border-4 border-transparent border-t-green-400 animate-spin"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed font-light">
                      {feature.description}
                    </p>
                    
                    {/* Real-time Working Demo */}
                    {!isWorking ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {feature.demo}
                          </div>
                          <div className="text-2xl opacity-60">
                            {feature.particles}
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30">
                          <div className="text-sm text-gray-400 mb-2">Demo Preview:</div>
                          <div className="text-lg font-mono">
                            <div className="text-cyan-300">{feature.workingDemo.input}</div>
                            <div className="text-gray-500 my-1">↓</div>
                            <div className="text-purple-300">{feature.workingDemo.output}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Live Processing Status */}
                        <div className="bg-gray-800/80 rounded-2xl p-4 border border-green-500/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-green-400 font-semibold text-sm">
                              {feature.steps[workingState.step]}
                            </div>
                            <div className="text-green-400 font-mono text-sm">
                              {Math.round(workingState.progress)}%
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-3 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-300 relative`}
                              style={{ width: `${workingState.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                          
                          {/* Live Demo Steps */}
                          <div className="space-y-2">
                            <div className="text-xs text-gray-400">Live Process:</div>
                            {feature.workingDemo.process.map((step, stepIndex) => (
                              <div 
                                key={stepIndex}
                                className={`text-sm font-mono flex items-center space-x-2 transition-all duration-300 ${
                                  stepIndex <= workingState.step ? 'text-green-400' : 'text-gray-500'
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${stepIndex <= workingState.step ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`}></div>
                                <span>{step}</span>
                                {stepIndex === workingState.step && workingState.isProcessing && (
                                  <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {/* Result */}
                          {workingState.progress === 100 && (
                            <div className="mt-4 p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                              <div className="text-green-400 font-semibold text-sm mb-1">✅ Result:</div>
                              <div className="text-white font-mono">{feature.workingDemo.output}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Button */}
                    <button 
                      className={`w-full py-3 rounded-2xl bg-gradient-to-r ${feature.color} font-semibold text-white transition-all duration-500 mt-4 ${
                        isWorking 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'opacity-0 group-hover:opacity-100 hover:shadow-lg hover:scale-105'
                      }`}
                      disabled={workingState.isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!workingState.isProcessing) startProcessing(index);
                      }}
                    >
                      {workingState.isProcessing ? 'Processing...' : 'Try Live Demo →'}
                    </button>
                    
                    {/* Shine Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ${isActive ? 'translate-x-[100%]' : ''} ${isWorking ? 'translate-x-[100%] duration-2000' : ''}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Analytics Dashboard */}
      <section id="analytics" className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-purple-500/30">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold tracking-wide">ANALYTICS DASHBOARD</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Intelligence Insights
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light">
              Track performance and AI tool usage with 
              <span className="text-pink-400 font-medium"> detailed analytics</span>
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl rounded-3xl p-10 border border-gray-700/50 shadow-2xl overflow-hidden">
              
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"></div>
              </div>
              
              {/* Stats Grid */}
              <div className="relative grid md:grid-cols-3 gap-8 mb-12">
                {[
                  { title: "Documents Processed", value: "12,847", growth: "+23%", icon: FileText, color: "from-cyan-500 to-blue-500" },
                  { title: "AI Operations", value: "45,291", growth: "+34%", icon: Cpu, color: "from-purple-500 to-pink-500" },
                  { title: "Time Saved", value: "127 hrs", growth: "+18%", icon: Zap, color: "from-green-500 to-teal-500" }
                ].map((item, index) => (
                  <div key={index} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 group-hover:opacity-20 rounded-2xl blur transition-opacity duration-500`}></div>
                    <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-600/50 group-hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-300">{item.title}</h3>
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="text-4xl font-black text-white mb-3">{item.value}</div>
                      <div className="text-green-400 flex items-center font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {item.growth} this month
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Chart Visualization */}
              <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">Usage Analytics</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                      <span className="text-gray-400 text-sm">Processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                      <span className="text-gray-400 text-sm">Generation</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-64 bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl flex items-end justify-around p-6 overflow-hidden relative">
                  {/* Animated Bars */}
                  {[0.6, 0.8, 0.4, 0.9, 0.7, 0.5, 1.0, 0.6, 0.8, 0.3, 0.9, 0.7].map((height, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className={`bg-gradient-to-t ${index % 2 === 0 ? 'from-cyan-500 to-blue-500' : 'from-purple-500 to-pink-500'} rounded-t-lg transition-all duration-1000 hover:scale-110 shadow-lg`}
                        style={{ 
                          height: `${height * 100}%`, 
                          width: '20px',
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 font-mono">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  
                  {/* Glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-purple-500/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-32 bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-16 border border-gray-700/50 overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Ready to Transform
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Your Workflow?
                  </span>
                </h2>
                <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                  Join <span className="text-cyan-400 font-semibold">thousands of users</span> who are already 
                  <span className="text-purple-400 font-semibold"> saving time</span> and 
                  <span className="text-pink-400 font-semibold"> increasing productivity</span> with Microfix.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                  <button onClick={() => navigate('/login')} className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full text-2xl font-bold shadow-2xl shadow-purple-500/40 hover:shadow-cyan-500/60 transition-all duration-700 hover:scale-110 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center space-x-4">
                      <span>Get Started Now</span>
                      <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-500" />
                    </span>
                  </button>
                  
                  <div className="text-center">
                    <p className="text-gray-400 font-medium">No credit card required</p>
                    <p className="text-cyan-400 font-semibold">Free 14-day trial</p>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 opacity-60">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Instant Setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Enterprise Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">24/7 Support</span>
                  </div>
                </div>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 py-16 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl border-t border-gray-700/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center space-x-4 group mb-8 md:mb-0">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:shadow-cyan-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  Microfix
                </span>
                <div className="text-sm text-cyan-400 font-medium tracking-widest">AI POWERED REVOLUTION</div>
              </div>
            </div>
            
            <div className="flex space-x-12 text-gray-400">
              {['Privacy', 'Terms', 'Support', 'API'].map((item, index) => (
                <a key={item} href="#" className="relative group hover:text-cyan-400 transition-colors duration-300 font-medium">
                  <span>{item}</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-center border-t border-gray-700/50 pt-8">
            <p className="text-gray-500 font-light">
              © 2025 Microfix. All rights reserved. Built with 
              <span className="text-cyan-400 font-medium"> AI-powered innovation</span> and 
              <span className="text-purple-400 font-medium"> cutting-edge technology</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}