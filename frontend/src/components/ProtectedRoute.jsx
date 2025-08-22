import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-950">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-200/20 border-t-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-purple-300/20 border-b-purple-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute; 