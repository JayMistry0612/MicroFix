import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Key, Sparkles } from 'lucide-react';

const VerifyOtpPage = () => {
  const { verifyOtp, resendOtp } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from router state
  const email = location.state?.email;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      // If no email passed, redirect to register
      navigate('/register');
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const res = await verifyOtp(email, otp);
    setLoading(false);
    if (res.success) {
      setSuccess('OTP verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(res.message);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    const res = await resendOtp(email);
    if (res.success) {
      setSuccess('OTP resent successfully! Check your email.');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-900 flex items-center justify-center px-4 py-8 overflow-hidden">
      
      {/* Decorative backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-violet-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-orange-400 rounded-full blur-xl opacity-15 animate-pulse"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute w-3 h-3 text-cyan-400 opacity-30 animate-pulse"
            style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 3) * 20}%`, animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </div>

      {/* OTP Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-lg animate-pulse">
            <Key className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Verify Email</h2>
          <p className="text-slate-300 mt-2">OTP sent to <span className="font-semibold">{email}</span></p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-emerald-400 text-sm">{success}</p>}

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all duration-300"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-slate-700/50 text-cyan-400 py-2 rounded-xl border border-cyan-400/30 hover:bg-slate-700/70 transition-all duration-300"
            >
              Resend OTP
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-slate-400 text-sm">
          🛡️ Your data is protected and encrypted
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
