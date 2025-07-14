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

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/login', { username, password });
      Cookies.set('jwt_token', res.data.access_token);
      Cookies.set('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('/api/register', { username, email, password });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    Cookies.remove('jwt_token');
    Cookies.remove('user');
    setUser(null);
  };

  const getToken = () => Cookies.get('jwt_token');

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 