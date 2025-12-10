'use client'

import { useEffect, useState } from 'react'
import { Heart, TrendingUp, AlertCircle, Calendar, User, BarChart3, LineChart as LineChartIcon } from 'lucide-react'
import { fetchMoodEntries, fetchHealthData, fetchBookings } from '@/lib/api-client'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [moodEntries, setMoodEntries] = useState([])
  const [healthData, setHealthData] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [moodStats, setMoodStats] = useState({ average: 0, trend: 'stable', improvement: 0 })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          window.location.href = '/auth/signin'
          return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)

        // Fetch mood entries, health data, and bookings
        const [moods, health, bookingData] = await Promise.all([
          fetchMoodEntries(userData.id, 30),
          fetchHealthData(userData.id),
          fetchBookings(userData.email),
        ])

        setMoodEntries(moods || [])
        setHealthData(health || [])
        setBookings(bookingData || [])

        // Calculate mood statistics
        if (moods && moods.length > 0) {
          const avgMood = Math.round(
            moods.reduce((sum, m) => sum + m.moodLevel, 0) / moods.length
          )
          const recentAvg = Math.round(
            moods.slice(0, 7).reduce((sum, m) => sum + m.moodLevel, 0) / Math.min(7, moods.length)
          )
          const trend = recentAvg > avgMood ? 'improving' : recentAvg < avgMood ? 'declining' : 'stable'

          setMoodStats({
            average: avgMood,
            trend,
            improvement: recentAvg - avgMood,
          })
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Generate mood chart data
  const getMoodChartData = () => {
    if (moodEntries.length === 0) return []
    return moodEntries.slice(0, 14).reverse().map((entry, i) => ({
      day: i + 1,
      mood: entry.moodLevel,
      label: entry.moodLabel,
    }))
  }

  const chartData = getMoodChartData()
  const maxMood = Math.max(...chartData.map((d) => d.mood), 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.firstName}</span>
          </h1>
          <p className="text-gray-600">Track your mental health progress and connect with professionals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Mood Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Overall Mood</h2>
              <Heart className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{moodStats.average}/10</div>
            <p className="text-sm text-gray-600 mb-3">
              Based on {moodEntries.length} entries
            </p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                moodStats.trend === 'improving'
                  ? 'bg-green-100 text-green-800'
                  : moodStats.trend === 'declining'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {moodStats.trend.charAt(0).toUpperCase() + moodStats.trend.slice(1)}
              </span>
              {moodStats.improvement !== 0 && (
                <span className={`text-sm font-medium ${
                  moodStats.improvement > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {moodStats.improvement > 0 ? '+' : ''}{moodStats.improvement}
                </span>
              )}
            </div>
          </div>

          {/* Health Conditions Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Health Conditions</h2>
              <AlertCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{healthData.length}</div>
            <p className="text-sm text-gray-600 mb-3">Tracked conditions</p>
            {healthData.length > 0 && (
              <div className="space-y-2">
                {healthData.slice(0, 2).map((h) => (
                  <div key={h.id} className="text-sm">
                    <span className="font-medium text-gray-700">{h.condition}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      h.severity === 'severe'
                        ? 'bg-red-100 text-red-800'
                        : h.severity === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {h.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booked Psychiatrist Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Next Appointment</h2>
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            {bookings.length > 0 ? (
              <div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {bookings[0].psychiatristName || 'Dr. ' + bookings[0].psychiatristId}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="block">{new Date(bookings[0].bookingDate).toLocaleDateString()}</span>
                  <span className="block">{bookings[0].timeSlot}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  bookings[0].status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : bookings[0].status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {bookings[0].status}
                </span>
              </div>
            ) : (
              <div className="text-gray-600 text-sm">
                <p className="mb-3">No appointments scheduled</p>
                <Link
                  href="/psychiatrists"
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mood Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <LineChartIcon className="w-6 h-6 text-blue-600" />
              Mood Trend (Last 14 Days)
            </h2>
          </div>

          {chartData.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex items-end gap-2 h-64 min-w-full p-4 bg-gray-50 rounded-lg">
                {chartData.map((data) => {
                  const heightPercent = (data.mood / maxMood) * 100
                  return (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex justify-center">
                        <div
                          className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer group relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            Day {data.day}: {data.mood}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 text-center">D{data.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No mood data yet. Start tracking to see your trend!</p>
              <Link
                href="/chatbot"
                className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Log Your Mood
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Mood Entries */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Recent Mood Entries
            </h2>

            {moodEntries.length > 0 ? (
              <div className="space-y-4">
                {moodEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          entry.moodLevel >= 8
                            ? 'bg-green-500'
                            : entry.moodLevel >= 5
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}>
                          {entry.moodLevel}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{entry.moodLabel}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {entry.problem && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm">
                        <p className="font-medium text-red-900 mb-1">Problem:</p>
                        <p className="text-red-700">{entry.problem}</p>
                      </div>
                    )}

                    {entry.improvement && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg text-sm">
                        <p className="font-medium text-green-900 mb-1">Improvement:</p>
                        <p className="text-green-700">{entry.improvement}</p>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                        <p className="font-medium text-blue-900 mb-1">Notes:</p>
                        <p className="text-blue-700">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No mood entries yet</p>
              </div>
            )}
          </div>

          {/* Health Conditions List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600" />
              Health Conditions
            </h2>

            {healthData.length > 0 ? (
              <div className="space-y-4">
                {healthData.map((health) => (
                  <div key={health.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{health.condition}</p>
                        <p className="text-sm text-gray-600">
                          Status: <span className="font-medium capitalize">{health.status}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        health.severity === 'severe'
                          ? 'bg-red-100 text-red-800'
                          : health.severity === 'moderate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {health.severity}
                      </span>
                    </div>

                    {health.description && (
                      <p className="text-sm text-gray-700 mt-2">{health.description}</p>
                    )}

                    {health.treatmentStartDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Started: {new Date(health.treatmentStartDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No health conditions recorded</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Add Condition
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/chatbot"
            className="group p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <p className="font-semibold group-hover:translate-x-1 transition">Chat with AI Support</p>
            <p className="text-sm text-blue-100 mt-1">Get instant mental health guidance</p>
          </Link>

          <Link
            href="/psychiatrists"
            className="group p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <p className="font-semibold group-hover:translate-x-1 transition">Browse Psychiatrists</p>
            <p className="text-sm text-purple-100 mt-1">Connect with mental health experts</p>
          </Link>

          <Link
            href="/resources"
            className="group p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <p className="font-semibold group-hover:translate-x-1 transition">Wellness Resources</p>
            <p className="text-sm text-green-100 mt-1">Explore mental health tools</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
