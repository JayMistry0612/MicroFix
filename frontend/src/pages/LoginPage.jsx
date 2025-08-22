import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User, Lock, LogIn, Sparkles, Key, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false); // modal toggle
  const navigate = useNavigate();
  const { login, forgotPassword, resetPassword } = useContext(AuthContext);

  // Login submit
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

  // Forgot Password Modal content
  const ForgotPasswordModal = ({ closeModal }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
      setError(''); setSuccess(''); setLoading(true);
      const res = await forgotPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccess(res.message); setStep(2);
      } else setError(res.message);
    };

    const handleReset = async () => {
      setError(''); setSuccess('');
      if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
      setLoading(true);
      const res = await resetPassword(email, otp, newPassword);
      setLoading(false);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => closeModal(), 2000);
      } else setError(res.message);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8 max-w-md w-full">
          <button onClick={closeModal} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-cyan-400/30 shadow-lg animate-pulse">
              <Key className="w-10 h-10 text-cyan-400 drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Forgot Password</h2>
            <p className="text-slate-300 mt-2 font-medium">
              {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
            </p>
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-emerald-400 text-sm">{success}</p>}
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-cyan-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-emerald-400 text-sm">{success}</p>}
                <button
                  onClick={handleReset}
                  className="w-full bg-emerald-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
          <div className="relative text-center mb-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <LogIn className="w-10 h-10 text-emerald-400 drop-shadow-lg" />
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Welcome Back</h2>
            <p className="text-slate-300 mt-2 font-medium">Access your account</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-emerald-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-emerald-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              onClick={() => setForgotOpen(true)}
              className="w-full text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {forgotOpen && <ForgotPasswordModal closeModal={() => setForgotOpen(false)} />}
    </div>
  );
};

export default LoginPage;
