'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Calendar, Heart, Menu, Minus, TrendingDown, TrendingUp, X } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '@/app/components/Dashboard/Sidebar'
import { fetchMoodEntries, fetchHealthData, fetchBookings } from '@/lib/api-client'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [moodEntries, setMoodEntries] = useState([])
  const [healthData, setHealthData] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [moodStats, setMoodStats] = useState({ average: 0, trend: 'stable', improvement: 0 })
  const [showSidebar, setShowSidebar] = useState(false)

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
        const sortedMoods = [...moodList].sort((a, b) => new Date(b.date) - new Date(a.date))

        setMoodEntries(sortedMoods)
        setHealthData(health || [])
        setBookings(bookingData || [])

        if (sortedMoods.length > 0) {
          const avgMood = Math.round(
            sortedMoods.reduce((sum, m) => sum + m.moodLevel, 0) / sortedMoods.length
          )
          const recentAvg = Math.round(
            sortedMoods.slice(0, 7).reduce((sum, m) => sum + m.moodLevel, 0) / Math.min(7, sortedMoods.length)
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

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)')
    const updateSidebar = () => setShowSidebar(!media.matches)
    updateSidebar()
    media.addEventListener('change', updateSidebar)
    return () => media.removeEventListener('change', updateSidebar)
  }, [])

  const chartData = useMemo(() => {
    if (moodEntries.length === 0) return []
    const sortedEntries = [...moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date))
    return sortedEntries.slice(0, 14).reverse().map((entry, i) => ({
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
    const width = 320
    const height = 150
    const margin = 18
    if (chartData.length === 0) {
      return { width, height, margin, step: 0, yScale: 0, points: '' }
    }
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
  const trendMeta = moodStats.trend === 'improving'
    ? { label: 'Upward', Icon: TrendingUp, className: 'text-emerald-600' }
    : moodStats.trend === 'declining'
    ? { label: 'Downward', Icon: TrendingDown, className: 'text-rose-600' }
    : { label: 'Neutral', Icon: Minus, className: 'text-amber-600' }

  const riskData = useMemo(() => (
    [...moodEntries]
      .filter((m) => m.moodLevel <= 3)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((m) => ({
        id: m.id,
        date: m.date,
        mood: m.moodLevel,
        label: m.moodLabel,
        note: m.notes,
      }))
  ), [moodEntries])

  const bookingSummary = useMemo(() => {
    const total = bookings.length
    const now = new Date()
    const upcoming = bookings.filter((booking) => {
      if (!booking.bookingDate) return false
      const bookingDate = new Date(booking.bookingDate)
      if (Number.isNaN(bookingDate.getTime())) return false
      return bookingDate >= now && booking.status !== 'cancelled'
    }).length

    const counts = bookings.reduce((acc, booking) => {
      const status = booking.status || 'pending'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const breakdown = Object.entries(counts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count)

    if (breakdown.length === 0) {
      breakdown.push(
        { status: 'confirmed', count: 0 },
        { status: 'pending', count: 0 },
        { status: 'cancelled', count: 0 }
      )
    }

    return { total, upcoming, breakdown }
  }, [bookings])

  const upcomingBookings = useMemo(() => {
    const now = new Date()
    return bookings
      .map((booking) => {
        if (!booking.bookingDate) return null
        const bookingDate = new Date(booking.bookingDate)
        if (Number.isNaN(bookingDate.getTime())) return null
        return { ...booking, bookingDate }
      })
      .filter(Boolean)
      .filter((booking) => booking.bookingDate >= now && !['cancelled', 'completed'].includes(booking.status))
      .sort((a, b) => a.bookingDate - b.bookingDate)
      .slice(0, 3)
  }, [bookings])

  const formatBookingDate = (value) =>
    value.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

  const bookingStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'completed':
        return 'bg-slate-100 text-slate-600'
      case 'cancelled':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const riskSummary = useMemo(() => {
    const recentEntries = moodEntries.slice(0, 7)
    if (recentEntries.length === 0) {
      return { level: 'Unknown', className: 'bg-slate-100 text-slate-600', average: null }
    }
    const average = recentEntries.reduce((sum, entry) => sum + entry.moodLevel, 0) / recentEntries.length
    if (average <= 3) {
      return { level: 'High', className: 'bg-rose-100 text-rose-700', average: Math.round(average) }
    }
    if (average <= 5) {
      return { level: 'Medium', className: 'bg-amber-100 text-amber-700', average: Math.round(average) }
    }
    return { level: 'Low', className: 'bg-emerald-100 text-emerald-700', average: Math.round(average) }
  }, [moodEntries])

  const recentRiskIndicators = useMemo(() => riskData.slice(0, 3), [riskData])

  const improvementIndicators = useMemo(() => {
    const improvements = moodEntries
      .filter((entry) => entry.improvement)
      .slice(0, 3)
      .map((entry) => ({
        label: entry.improvement,
        detail: new Date(entry.date).toLocaleDateString(),
      }))

    if (improvements.length > 0) return improvements

    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 6)

    const weekEntries = moodEntries.filter((entry) => new Date(entry.date) >= weekAgo)
    const notesCount = moodEntries.filter((entry) => entry.notes).length
    const steadyEntries = moodEntries.filter((entry) => entry.moodLevel >= 6).length

    return [
      { label: 'Check-ins this week', detail: `${weekEntries.length}/7 logged` },
      { label: 'Positive moments', detail: `${steadyEntries} entries above 6` },
      { label: 'Reflection notes', detail: `${notesCount} saved` },
    ]
  }, [moodEntries])

  const displayName = useMemo(() => {
    if (!user) return 'Patient'
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
    if (fullName) return fullName
    if (user.email) return user.email.split('@')[0]
    return 'Patient'
  }, [user])

  const moodDeltaLabel = moodStats.improvement > 0
    ? `Up ${moodStats.improvement}`
    : moodStats.improvement < 0
    ? `Down ${Math.abs(moodStats.improvement)}`
    : 'No change'

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

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 lg:px-6">
        <header className="mb-6 rounded-3xl border border-white/70 bg-white/90 px-4 py-4 shadow-soft-2 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 shadow-soft-1 transition hover:-translate-y-0.5"
                aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
              >
                {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">MindCare AI</p>
                <h1 className="text-2xl font-bold text-slate-900">Patient Dashboard</h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500">
              <Link href="/dashboard" className="transition hover:text-slate-900">Overview</Link>
              <Link href="/psychiatrists" className="transition hover:text-slate-900">Bookings</Link>
              <Link href="/dashboard" className="transition hover:text-slate-900">Mood</Link>
              <Link href="/resources" className="transition hover:text-slate-900">Health</Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Welcome, {displayName}
              </div>
              <Link
                href="/resources"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-soft-2 transition hover:-translate-y-0.5"
              >
                Resources
              </Link>
            </div>
          </div>
        </header>

        {showSidebar && (
          <button
            type="button"
            onClick={() => setShowSidebar(false)}
            className="lg:hidden fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm"
            aria-label="Close sidebar overlay"
          />
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          {showSidebar && (
            <aside className="fixed left-4 top-28 z-40 w-[min(92vw,20rem)] lg:static lg:left-auto lg:top-auto lg:z-auto lg:w-80 lg:shrink-0">
              <Sidebar
                chartData={chartData}
                lineDims={lineDims}
                userGrowthData={userGrowthData}
                moodEntries={moodEntries}
                healthData={healthData}
                improvementIndicators={improvementIndicators}
              />
            </aside>
          )}

          <section className="flex-1 space-y-6">
            <div className="grid gap-6 xl:grid-cols-3">
              <div className={`${cardBase} p-6 xl:col-span-2`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Bookings Summary</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Sessions at a glance</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-100/70 p-2 text-emerald-700">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total bookings</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{bookingSummary.total}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Upcoming bookings</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{bookingSummary.upcoming}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status breakdown</p>
                    <Link href="/psychiatrists" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      Manage bookings
                    </Link>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200/70">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/80 text-left text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2 text-right">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingSummary.breakdown.map((row) => (
                          <tr key={row.status} className="border-t border-slate-200/70">
                            <td className="px-4 py-2 capitalize text-slate-700">{row.status}</td>
                            <td className="px-4 py-2 text-right font-semibold text-slate-900">{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Upcoming sessions</p>
                    <span className="text-xs text-slate-400">Next 3</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {booking.psychiatristName || 'Psychiatrist'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatBookingDate(booking.bookingDate)} · {booking.timeSlot || 'Time TBD'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${bookingStatusStyle(booking.status)}`}>
                            {booking.status || 'pending'}
                          </span>
                          {booking.psychiatristId && (
                            <Link
                              href={`/psychiatrists/${booking.psychiatristId}`}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-500">
                        No upcoming sessions scheduled yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${cardBase} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mood Summary</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{moodStats.average}/10</p>
                    <p className="text-sm text-slate-500">Average mood score</p>
                  </div>
                  <div className="rounded-2xl bg-rose-100/70 p-2 text-rose-600">
                    <Heart className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${trendPill}`}>
                    {moodStats.trend.charAt(0).toUpperCase() + moodStats.trend.slice(1)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <trendMeta.Icon className={`h-4 w-4 ${trendMeta.className}`} />
                    <span>{trendMeta.label} trend</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-500">{moodDeltaLabel} vs baseline</p>
              </div>

              <div className={`${cardBase} p-6 xl:col-span-3`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Risk Data Summary</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Current risk level</p>
                  </div>
                  <div className="rounded-2xl bg-rose-100/70 p-2 text-rose-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskSummary.className}`}>
                    {riskSummary.level}
                  </span>
                  {riskSummary.average !== null && (
                    <p className="text-sm text-slate-500">Avg mood last 7 days: {riskSummary.average}/10</p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent risk indicators</p>
                  <div className="mt-2 space-y-2">
                    {recentRiskIndicators.length > 0 ? recentRiskIndicators.map((risk) => (
                      <div
                        key={risk.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm"
                      >
                        <div>
                          <p className="font-semibold capitalize text-slate-700">{risk.label}</p>
                          <p className="text-xs text-slate-500">{new Date(risk.date).toLocaleDateString()}</p>
                        </div>
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-600">
                          {risk.mood}/10
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500">No recent risk indicators.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
