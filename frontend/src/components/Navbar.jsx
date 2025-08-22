import React, { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Home, FileText, Image as ImageIcon, FileAudio, Zap, History as HistoryIcon, Brain, LogOut, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileOpen(false);
  };

  return (
    <nav className="relative flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-slate-100">
      {/* Brand */}
      <Link to="/home" className="flex items-center gap-2 font-bold text-white">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30">
          <Brain className="w-5 h-5 text-purple-300" />
        </span>
        <span className="bg-gradient-to-r from-purple-300 to-sky-300 bg-clip-text text-transparent">MicroFix</span>
      </Link>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center gap-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/pdf"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <FileText className="w-4 h-4" />
          <span>PDF</span>
        </NavLink>
        <NavLink
          to="/image"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image</span>
        </NavLink>
        <NavLink
          to="/audio"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <FileAudio className="w-4 h-4" />
          <span>Audio</span>
        </NavLink>
        <NavLink
          to="/tone"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <Zap className="w-4 h-4" />
          <span>Tone</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <HistoryIcon className="w-4 h-4" />
          <span>History</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
              isActive
                ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
            }`
          }
        >
          <Brain className="w-4 h-4" />
          <span>Analytics</span>
        </NavLink>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800"
        onClick={() => setIsMobileOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-nav"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Right Side (Auth Section) */}
      {user ? (
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[10rem]">{user.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg shadow-md transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      ) : (
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="hover:text-sky-400 transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-sky-400 transition-colors font-medium"
          >
            Register
          </Link>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {isMobileOpen && (
        <div id="mobile-nav" className="absolute top-full left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 md:hidden">
          <div className="px-4 py-4 space-y-6">
            <div className="grid grid-cols-2 gap-2">
              <NavLink to="/home" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                Home
              </NavLink>
              <NavLink to="/pdf" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                PDF
              </NavLink>
              <NavLink to="/image" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                Image
              </NavLink>
              <NavLink to="/audio" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                Audio
              </NavLink>
              <NavLink to="/tone" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                Tone
              </NavLink>
              <NavLink to="/history" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                History
              </NavLink>
              <NavLink to="/analytics" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`}>
                Analytics
              </NavLink>
            </div>
            <div className="border-t border-slate-800 pt-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <User className="w-4 h-4" />
                    <span className="truncate max-w-[10rem]">{user.username}</span>
                  </div>
                  <button onClick={handleLogout} className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setIsMobileOpen(false); navigate('/login'); }} className="px-3 py-2 rounded-lg text-sm bg-slate-100 text-slate-900 hover:bg-white">
                    Login
                  </button>
                  <button onClick={() => { setIsMobileOpen(false); navigate('/register'); }} className="px-3 py-2 rounded-lg text-sm border border-slate-700 text-slate-200 hover:bg-slate-800">
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
