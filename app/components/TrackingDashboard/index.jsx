'use client'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertCircle, Zap, Heart } from 'lucide-react';

export default function TrackingDashboard({ userId }) {
  const [trackingData, setTrackingData] = useState({
    mood: [],
    growth: [],
    improvement: [],
    risk: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageMood: 0,
    growthCount: 0,
    improvementCount: 0,
    riskIncidents: 0,
  });

  useEffect(() => {
    const loadTrackingData = async () => {
      if (typeof window === 'undefined') return;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        if (!user?.id) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/chatbot/tracking?userId=${userId}`, {
          headers: {
            'x-user-id': user.id,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tracking data');
        }

        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid tracking data received');
        }

        setTrackingData(data);

        // Calculate statistics
        if (data.mood && data.mood.length > 0) {
          const avgMood = (data.mood.reduce((sum, entry) => sum + entry.moodLevel, 0) / data.mood.length).toFixed(1);
          setStats(prev => ({ ...prev, averageMood: avgMood }));
        }

        if (data.growth) {
          setStats(prev => ({ ...prev, growthCount: data.growth.length }));
        }

        if (data.improvement) {
          setStats(prev => ({ ...prev, improvementCount: data.improvement.length }));
        }

        if (data.risk) {
          setStats(prev => ({ ...prev, riskIncidents: data.risk.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length }));
        }
      } catch (err) {
        console.error('Error loading tracking data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare mood chart data
  const moodChartData = trackingData.mood?.slice(0, 30).reverse().map((entry, index) => ({
    date: new Date(entry.date).toLocaleDateString(),
    mood: entry.moodLevel,
    label: entry.moodLabel,
  })) || [];

  // Prepare improvement areas chart
  const improvementData = trackingData.improvement?.reduce((acc, item) => {
    const existing = acc.find(d => d.area === item.improvementArea);
    if (existing) {
      existing.count += 1;
      existing.level = (existing.level + item.improvementLevel) / 2;
    } else {
      acc.push({
        area: item.improvementArea,
        count: 1,
        level: item.improvementLevel,
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Mood</p>
              <p className="text-3xl font-bold text-blue-600">{stats.averageMood}</p>
              <p className="text-gray-500 text-xs mt-1">out of 10</p>
            </div>
            <Heart className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Growth Moments</p>
              <p className="text-3xl font-bold text-green-600">{stats.growthCount}</p>
              <p className="text-gray-500 text-xs mt-1">detected</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Improvements</p>
              <p className="text-3xl font-bold text-purple-600">{stats.improvementCount}</p>
              <p className="text-gray-500 text-xs mt-1">tracked</p>
            </div>
            <Zap className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Risk Alerts</p>
              <p className="text-3xl font-bold text-red-600">{stats.riskIncidents}</p>
              <p className="text-gray-500 text-xs mt-1">high/critical</p>
            </div>
            <AlertCircle className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Mood Trend Chart */}
      {moodChartData.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={moodChartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis domain={[1, 10]} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                formatter={(value) => [value, 'Mood Level']}
              />
              <Area type="monotone" dataKey="mood" stroke="#3b82f6" fill="url(#moodGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Improvement Areas Chart */}
      {improvementData.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Improvement Areas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={improvementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="area" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="level" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Growth */}
      {trackingData.growth && trackingData.growth.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Growth</h3>
          <div className="space-y-3">
            {trackingData.growth.slice(0, 5).map((growth) => (
              <div key={growth.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{growth.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{growth.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(growth.detectedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Risks */}
      {trackingData.risk && trackingData.risk.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Alerts</h3>
          <div className="space-y-3">
            {trackingData.risk.slice(0, 5).map((risk) => (
              <div key={risk.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                risk.riskLevel === 'high' || risk.riskLevel === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <AlertCircle className={`flex-shrink-0 mt-1 ${
                  risk.riskLevel === 'high' || risk.riskLevel === 'critical'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`} size={20} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{risk.riskType}</p>
                  <p className="text-sm text-gray-600 mt-1">{risk.indicator}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(risk.detectedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && moodChartData.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <Heart className="mx-auto text-blue-600 mb-4" size={40} />
          <p className="text-gray-700 font-medium">No tracking data yet</p>
          <p className="text-gray-600 text-sm mt-2">Start chatting with MindCare AI to begin tracking your mood, growth, and improvements.</p>
        </div>
      )}
    </div>
  );
}
