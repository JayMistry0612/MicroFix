import React, { useState,useContext } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(username, password);
    setLoading(false);
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs with Tailwind animations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse [animation-delay:0s]"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-32 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse [animation-delay:4s]"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse [animation-delay:6s]"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full opacity-40 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
        
        {/* Moving Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-emerald-400 opacity-10 animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-cyan-400 opacity-10 animate-pulse [animation-delay:3s]"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-emerald-400 rotate-45 opacity-15 animate-spin [animation-duration:10s]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-cyan-400 rotate-12 opacity-15 animate-bounce [animation-delay:1s]"></div>
        <div className="absolute top-1/2 right-1/5 w-12 h-12 bg-violet-500 opacity-10 animate-ping [animation-delay:2s]"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Login Card with Glassmorphism */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-cyan-500/20 hover:scale-105 hover:border-cyan-500/30">
            {/* Header */}
            <div className="relative bg-slate-800/60 backdrop-blur-sm px-8 py-8 border-b border-slate-700/50">
              {/* Sparkle Animation */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute w-3 h-3 text-cyan-400 opacity-30 animate-pulse"
                    style={{
                      left: `${15 + i * 12}%`,
                      top: `${25 + (i % 2) * 30}%`,
                      animationDelay: `${i * 0.8}s`
                    }}
                  />
                ))}
              </div>
              
              <div className="relative text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-emerald-400/30 shadow-lg animate-pulse">
                  <LogIn className="w-10 h-10 text-emerald-400 drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">Welcome Back</h2>
                <p className="text-slate-300 mt-2 font-medium">Access your account</p>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <div className="space-y-6">
                {/* Username Field */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-200 block">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-300 transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 text-white placeholder-slate-400 backdrop-blur-sm hover:bg-slate-700/70 focus:bg-slate-700/80 hover:border-emerald-500/50"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-200 block">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-emerald-400 group-focus-within:text-emerald-300 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-14 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 text-white placeholder-slate-400 backdrop-blur-sm hover:bg-slate-700/70 focus:bg-slate-700/80 hover:border-emerald-500/50"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-emerald-300 transition-colors duration-300 text-emerald-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-emerald-500 text-slate-900 py-4 px-6 rounded-xl font-bold hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-emerald-500/50 relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-slate-700/30 border-t-slate-900 rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Additional Links */}
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="text-center space-y-3">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300 hover:underline">
                    Forgot your password?
                  </button>
                  <p className="text-slate-400 text-sm">
                    Don't have an account?{' '}
                    <button onClick={() => navigate('/register')} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 hover:underline">
                      Create one now
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm font-medium">
              🔒 Secured with advanced encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;