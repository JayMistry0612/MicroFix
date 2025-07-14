import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PdfSummaryPage from './pages/PdfSummaryPage';
import ImageCaptionPage from './pages/ImageCaptionPage';
import AudioMoodPage from './pages/AudioMoodPage';
import ToneChangerPage from './pages/ToneChangerPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pdf" element={<ProtectedRoute><PdfSummaryPage /></ProtectedRoute>} />
      <Route path="/image" element={<ProtectedRoute><ImageCaptionPage /></ProtectedRoute>} />
      <Route path="/audio" element={<ProtectedRoute><AudioMoodPage /></ProtectedRoute>} />
      <Route path="/tone" element={<ProtectedRoute><ToneChangerPage /></ProtectedRoute>} />
    </Routes>
  </Router>
);

export default App; 