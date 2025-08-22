import React, { useState, useEffect, useContext } from 'react';
import { FileText, Sparkles, Brain } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF0066'];

const AnalyticDashboard = () => {
  const { getToken } = useContext(AuthContext);
  const [reductionData, setReductionData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/analytics', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setReductionData(res.data.reductionData || []);
      setMoodData(res.data.moodDetection || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();

    const handleResize = () => setIsMobile(window.innerWidth <= 820);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-400/20 rounded-lg rotate-12 animate-spin [animation-duration:15s]"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-teal-400/20 rounded-full animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-rose-400/10 rounded-lg animate-bounce [animation-delay:1s]"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: '4s'
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen relative z-10 p-4 md:p-8 flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* Word Reduction Chart */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden p-4 md:p-8">
            <h2 className="text-2xl text-white font-bold mb-4 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-teal-400" />
              <span>Word Reduction %</span>
            </h2>
            {loading ? (
              <div className="h-48 bg-slate-600/30 rounded animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 240}>
                <BarChart data={reductionData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="reduction" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Mood Detection */}
          <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden p-4 md:p-8">
            <h2 className="text-2xl text-white font-bold mb-4 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span>Mood Detection</span>
            </h2>
            {loading ? (
              <div className="h-72 bg-slate-600/30 rounded animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 320}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 80 : 110}
                    label={(entry) => `${entry.mood} (${entry.value}%)`}
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  {!isMobile && <Legend />}
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticDashboard;
