import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check for token and user in cookies
    const token = Cookies.get('jwt_token');
    const userData = Cookies.get('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login (only for verified users)
  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/login', { username, password });
      Cookies.set('jwt_token', res.data.access_token, { expires: 30, sameSite: 'lax' });
      Cookies.set('user', JSON.stringify(res.data.user), { expires: 30, sameSite: 'lax' });
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Login failed' };
    }
  };

  // Register and send OTP
  const register = async (username, email, password) => {
    try {
      await axios.post('/api/register', { username, email, password });
      return { success: true, email }; // return email to use in OTP page
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Registration failed' };
    }
  };

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post('/api/verify-otp', { email, otp });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'OTP verification failed' };
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    try {
      const res = await axios.post('/api/resend-otp', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Resend OTP failed' };
    }
  };

  // Send OTP for password reset
const forgotPassword = async (email) => {
  try {
    const res = await axios.post('/api/forgot-password', { email });
    return { success: true, message: res.data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || 'Forgot password failed' };
  }
};

// Reset password using OTP
const resetPassword = async (email, otp, newPassword) => {
  try {
    const res = await axios.post('/api/reset-password', { email, otp, newPassword });
    return { success: true, message: res.data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || 'Reset password failed' };
  }
};


  const logout = () => {
    Cookies.remove('jwt_token');
    Cookies.remove('user');
    setUser(null);
  };

  const getToken = () => Cookies.get('jwt_token');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      verifyOtp,
      resendOtp,
      logout,
      getToken,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
