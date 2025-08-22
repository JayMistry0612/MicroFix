import React, { useContext, useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  Home,
  FileText,
  Image as ImageIcon,
  FileAudio,
  Zap,
  History as HistoryIcon,
  Brain,
  User,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { to: "/home", icon: <Home className="w-4 h-4" />, label: "Home" },
    { to: "/pdf", icon: <FileText className="w-4 h-4" />, label: "PDF" },
    { to: "/image", icon: <ImageIcon className="w-4 h-4" />, label: "Image" },
    { to: "/audio", icon: <FileAudio className="w-4 h-4" />, label: "Audio" },
    { to: "/tone", icon: <Zap className="w-4 h-4" />, label: "Tone" },
    { to: "/history", icon: <HistoryIcon className="w-4 h-4" />, label: "History" },
    { to: "/analytics", icon: <Brain className="w-4 h-4" />, label: "Analytics" },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 relative">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2 font-bold text-white">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30">
            <Brain className="w-5 h-5 text-purple-300" />
          </span>
          <span className="bg-gradient-to-r from-purple-300 to-sky-300 bg-clip-text text-transparent">
            MicroFix
          </span>
        </Link>

        {/* Desktop nav links */}
        {isDesktop && (
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition font-medium ${
                    isActive
                      ? "bg-purple-500/20 text-purple-200 border-purple-400/30"
                      : "bg-slate-700/40 text-slate-200 border-slate-600/50 hover:bg-slate-700/60"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Right Side (Profile Icon for desktop) */}
        {isDesktop && user && (
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/60 text-white text-sm rounded-lg shadow-md transition"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{user.username}</span>
          </Link>
        )}

        {/* Hamburger for mobile */}
        {!isDesktop && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile sidebar */}
      {!isDesktop && (
        <div
          className={`fixed inset-0 z-50 flex transition-all duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`relative bg-slate-900 w-64 h-full p-6 flex flex-col space-y-6 transform transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-slate-100" />
            </button>

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-200 hover:bg-slate-800"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}

            {user && (
              <Link
                to="/profile"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700/40 hover:bg-slate-700/60 text-white text-sm rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>{user.username}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
