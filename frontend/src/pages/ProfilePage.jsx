import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { LogOut, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { getToken } = useContext(AuthContext);
  const {logout} = useContext(AuthContext);


  // Get token from localStorage (adjust if you use cookies/session)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await axios.delete("/api/delete-account", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center backdrop-blur-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-700/70 rounded-full">
            <User className="w-12 h-12 text-yellow-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
        <div className="text-slate-300 space-y-2 mb-6">
          <p><span className="font-semibold text-slate-100">Username:</span> {user.username}</p>
          <p><span className="font-semibold text-slate-100">Email:</span> {user.email}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-500 transition"
          >
            <Trash2 className="w-5 h-5" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
