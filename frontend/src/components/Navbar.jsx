import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center gap-6 px-6 py-3 bg-slate-800/40 backdrop-blur-xl border-b border-slate-700/50 text-slate-100">
      {/* Left Nav Links */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="hover:text-sky-400 transition-colors font-medium"
        >
          Home
        </Link>
        <Link
          to="/pdf"
          className="hover:text-sky-400 transition-colors font-medium"
        >
          PDF Summary
        </Link>
        <Link
          to="/image"
          className="hover:text-sky-400 transition-colors font-medium"
        >
          Image Caption
        </Link>
        <Link
          to="/audio"
          className="hover:text-sky-400 transition-colors font-medium"
        >
          Audio Mood
        </Link>
        <Link
          to="/tone"
          className="hover:text-sky-400 transition-colors font-medium"
        >
          Tone Changer
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side (Auth Section) */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">
            Welcome, <b className="text-slate-100">{user.username}</b>
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
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
    </nav>
  );
};

export default Navbar;
