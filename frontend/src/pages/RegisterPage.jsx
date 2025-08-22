import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, UserPlus, Key, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation rules
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password)) errors.push("Include at least 1 uppercase letter.");
    if (!/[a-z]/.test(password)) errors.push("Include at least 1 lowercase letter.");
    if (!/[0-9]/.test(password)) errors.push("Include at least 1 number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Include at least 1 special character.");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    setLoading(true);
    const res = await register(username, email, password);
    setLoading(false);

    if (res.success) {
      setSuccess('Registration successful! Redirecting to OTP verification...');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 flex items-center justify-center px-4 py-8">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-violet-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-orange-400 rounded-full blur-xl opacity-15 animate-pulse"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden p-8">
        {/* Header */}
        <div className="relative text-center mb-6">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-lg animate-pulse">
            <UserPlus className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Join Us</h2>
          <p className="text-slate-300 mt-2 font-medium">Create your new account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-emerald-400" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-cyan-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-violet-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-14 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-violet-400"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Password checklist */}
          <div className="text-xs text-slate-400 mt-1 space-y-1">
            <p className={password.length >= 8 ? 'text-emerald-400' : 'text-red-400'}>• At least 8 characters</p>
            <p className={/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-red-400'}>• 1 uppercase letter</p>
            <p className={/[a-z]/.test(password) ? 'text-emerald-400' : 'text-red-400'}>• 1 lowercase letter</p>
            <p className={/[0-9]/.test(password) ? 'text-emerald-400' : 'text-red-400'}>• 1 number</p>
            <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-emerald-400' : 'text-red-400'}>• 1 special character</p>
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-emerald-400 text-sm">{success}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-slate-900 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all duration-300"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400 text-sm">
          Already have an account? <span className="text-cyan-400 cursor-pointer" onClick={() => navigate('/login')}>Sign in here</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
