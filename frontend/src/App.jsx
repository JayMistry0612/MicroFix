import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PdfSummaryPage from './pages/PdfSummaryPage';
import ImageCaptionPage from './pages/ImageCaptionPage';
import AudioMoodPage from './pages/AudioMoodPage';
import ToneChangerPage from './pages/ToneChangerPage';
import ProtectedRoute from './components/ProtectedRoute';
import HistoryPage from './pages/HistoryPage';
import AnalyticDashboard from './pages/AnalyticDashboard';
import MicrofixLanding from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return(
    <Router>
      <AppRoutes />
    </Router>
  )
}

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<MicrofixLanding />} />
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pdf" element={<ProtectedRoute><PdfSummaryPage /></ProtectedRoute>} />
        <Route path="/image" element={<ProtectedRoute><ImageCaptionPage /></ProtectedRoute>} />
        <Route path="/audio" element={<ProtectedRoute><AudioMoodPage /></ProtectedRoute>} />
        <Route path="/tone" element={<ProtectedRoute><ToneChangerPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App; 