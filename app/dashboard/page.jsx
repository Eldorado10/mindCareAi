'use client'

import { useEffect, useState, useMemo } from 'react'
import { Heart, AlertCircle, Calendar } from 'lucide-react'
import { fetchMoodEntries, fetchHealthData, fetchBookings } from '@/lib/api-client'
import Sidebar from '@/app/components/Dashboard/Sidebar'
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
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          window.location.href = '/auth/signin'
          return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)

        const [moods, health, bookingData] = await Promise.all([
          fetchMoodEntries(userData.id, 30),
          fetchHealthData(userData.id),
          fetchBookings(userData.email),
        ])

        const sampleMoodEntries = () => {
          const today = new Date()
          const entries = []
          for (let i = 0; i < 30; i++) {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            const base = 4 + Math.min(i * 0.15, 6)
            const variance = Math.sin(i / 3) * 1.5
            const moodLevel = Math.max(1, Math.min(10, Math.round(base + variance)))
            const labels = ['calm', 'focused', 'anxious', 'optimistic', 'tired', 'happy']
            entries.push({
              id: `sample-${i}`,
              userId: userData.id,
              moodLevel,
              moodLabel: labels[moodLevel % labels.length],
              date: d.toISOString(),
              improvement: i % 5 === 0 ? 'Practiced mindfulness' : undefined,
              notes: i % 7 === 0 ? 'Stayed hydrated and slept well' : undefined,
            })
          }
          return entries
        }

        const moodList = (moods && moods.length > 0) ? moods : sampleMoodEntries()
        setMoodEntries(moodList)
        setHealthData(health || [])
        setBookings(bookingData || [])

        if (moodList && moodList.length > 0) {
          const avgMood = Math.round(
            moodList.reduce((sum, m) => sum + m.moodLevel, 0) / moodList.length
          )
          const recentAvg = Math.round(
            moodList.slice(0, 7).reduce((sum, m) => sum + m.moodLevel, 0) / Math.min(7, moodList.length)
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

  const chartData = useMemo(() => {
    if (moodEntries.length === 0) return []
    return moodEntries.slice(0, 14).reverse().map((entry, i) => ({
      day: i + 1,
      mood: entry.moodLevel,
      label: entry.moodLabel,
    }))
  }, [moodEntries])

  const maxMood = Math.max(...chartData.map((d) => d.mood), 10)

  const userGrowthData = useMemo(() => {
    if (moodEntries.length === 0) return []
    const groups = new Map()
    for (const entry of moodEntries) {
      const d = new Date(entry.date)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`
      const name = d.toLocaleString('default', { month: 'short' })
      const g = groups.get(key) || { sum: 0, count: 0, month: name }
      g.sum += entry.moodLevel
      g.count += 1
      groups.set(key, g)
    }
    const arr = Array.from(groups.entries())
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([, g]) => ({ month: g.month, score: Math.round(g.sum / g.count) }))
    return arr.slice(-6)
  }, [moodEntries])

  const lineDims = useMemo(() => {
    const width = 420
    const height = 180
    const margin = 20
    const step = chartData.length > 1 ? (width - margin * 2) / (chartData.length - 1) : 0
    const yScale = (height - margin * 2) / Math.max(maxMood, 1)
    const points = chartData.map((d, i) => {
      const x = margin + i * step
      const y = height - margin - d.mood * yScale
      return `${x},${y}`
    }).join(' ')
    return { width, height, margin, step, yScale, points }
  }, [chartData, maxMood])

  const cardBase = 'rounded-3xl border border-white/70 bg-white/90 shadow-soft-2 backdrop-blur'
  const trendPill = moodStats.trend === 'improving'
    ? 'bg-emerald-100 text-emerald-700'
    : moodStats.trend === 'declining'
    ? 'bg-rose-100 text-rose-700'
    : 'bg-amber-100 text-amber-700'
  const nextBooking = bookings[0]

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--dashboard-bg)' }}>
        <div className="pointer-events-none absolute -top-40 right-[-15%] h-80 w-80 rounded-full bg-[rgba(76,215,182,0.18)] blur-3xl" />
        <div className="pointer-events-none absolute top-32 left-[-10%] h-96 w-96 rounded-full bg-[rgba(91,139,245,0.16)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-[-20%] h-96 w-96 rounded-full bg-[rgba(251,113,133,0.12)] blur-3xl" />
        <div className="relative flex min-h-screen items-center justify-center px-6">
          <div className={`${cardBase} p-8 text-center`}>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500"></div>
            <p className="text-slate-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--dashboard-bg)' }}>
      <div className="pointer-events-none absolute -top-40 right-[-15%] h-80 w-80 rounded-full bg-[rgba(76,215,182,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-[-10%] h-96 w-96 rounded-full bg-[rgba(91,139,245,0.16)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-20%] h-96 w-96 rounded-full bg-[rgba(251,113,133,0.12)] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className={`${cardBase} relative overflow-hidden p-8 animate-fade-in-up`}>
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-12 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">MindCare Dashboard</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  {user?.firstName}
                </span>
              </h1>
              <p className="mt-2 text-slate-600">
                Track your mental health journey and stay connected with support.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chatbot"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-soft-2 transition hover:-translate-y-0.5"
              >
                Log Mood
              </Link>
              <Link
                href="/psychiatrists"
                className="rounded-xl border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-soft-1 transition hover:-translate-y-0.5"
              >
                Book Session
              </Link>
            </div>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2">
              {moodEntries.length} entries this month
            </span>
            <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2">
              {healthData.length} conditions tracked
            </span>
            <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2">
              {bookings.length > 0 ? 'Next session scheduled' : 'No sessions scheduled'}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className={`${cardBase} p-6 animate-fade-in-up`} style={{ animationDelay: '0.05s' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Overall Mood</p>
                    <p className="mt-3 text-4xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                      {moodStats.average}/10
                    </p>
                    <p className="text-sm text-slate-500">Based on {moodEntries.length} entries</p>
                  </div>
                  <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${trendPill}`}>
                    {moodStats.trend.charAt(0).toUpperCase() + moodStats.trend.slice(1)}
                  </span>
                  {moodStats.improvement !== 0 && (
                    <span className={`text-sm font-semibold ${moodStats.improvement > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {moodStats.improvement > 0 ? '+' : ''}
                      {moodStats.improvement}
                    </span>
                  )}
                </div>
              </div>

              <div className={`${cardBase} p-6 animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health Conditions</p>
                    <p className="mt-3 text-4xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
                      {healthData.length}
                    </p>
                    <p className="text-sm text-slate-500">Tracked conditions</p>
                  </div>
                  <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  {healthData.length > 0 ? 'Monitoring your health insights.' : 'Add a condition to start tracking.'}
                </p>
              </div>

              <div className={`${cardBase} p-6 animate-fade-in-up`} style={{ animationDelay: '0.15s' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next Appointment</p>
                    <p className="mt-3 text-2xl font-semibold" style={{ color: 'var(--dashboard-text-primary)' }}>
                      {nextBooking ? (nextBooking.psychiatristName || `Dr. ${nextBooking.psychiatristId}`) : 'No visits'}
                    </p>
                    {nextBooking ? (
                      <div className="mt-2 text-sm text-slate-500">
                        <span className="block">{new Date(nextBooking.bookingDate).toLocaleDateString()}</span>
                        <span className="block">{nextBooking.timeSlot}</span>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">No appointments scheduled yet.</p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                {nextBooking ? (
                  <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    nextBooking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : nextBooking.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {nextBooking.status}
                  </span>
                ) : (
                  <Link
                    href="/psychiatrists"
                    className="mt-4 inline-flex rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-soft-1 transition hover:-translate-y-0.5"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/chatbot"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-5 text-white shadow-soft-2 transition hover:-translate-y-1"
              >
                <p className="font-semibold text-lg">Chat with AI Support</p>
                <p className="text-sm text-white/80 mt-1">Get instant mental health guidance</p>
              </Link>

              <Link
                href="/psychiatrists"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-400 p-5 text-white shadow-soft-2 transition hover:-translate-y-1"
              >
                <p className="font-semibold text-lg">Browse Psychiatrists</p>
                <p className="text-sm text-white/80 mt-1">Connect with mental health experts</p>
              </Link>

              <Link
                href="/resources"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-soft-2 transition hover:-translate-y-1"
              >
                <p className="font-semibold text-lg">Wellness Resources</p>
                <p className="text-sm text-white/80 mt-1">Explore mental health tools</p>
              </Link>
            </div>
          </div>

          <Sidebar
            chartData={chartData}
            maxMood={maxMood}
            lineDims={lineDims}
            userGrowthData={userGrowthData}
            moodEntries={moodEntries}
            healthData={healthData}
          />
        </div>
      </div>
    </div>
  )
}
