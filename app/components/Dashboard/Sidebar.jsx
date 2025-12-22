'use client'

import Link from 'next/link'
import { Activity, ChevronRight, Heart, Shield } from 'lucide-react'

export default function Sidebar({
  chartData,
  lineDims,
  userGrowthData,
  moodEntries,
  healthData,
  improvementIndicators,
}) {
  const cardBase = 'rounded-3xl border border-white/70 bg-white/90 shadow-soft-2 backdrop-blur'
  const sortedMoods = [...moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date))
  const recentMoodEntries = sortedMoods.slice(0, 5)
  const hasMoodChart = chartData.length > 1 && lineDims.points
  const areaPoints = hasMoodChart
    ? `${lineDims.points} ${lineDims.width - lineDims.margin},${lineDims.height - lineDims.margin} ${lineDims.margin},${lineDims.height - lineDims.margin}`
    : ''

  const healthItems = Array.isArray(healthData) ? healthData : []
  const activeConditions = healthItems.filter((item) => item.status === 'active').length
  const healthDates = healthItems
    .map((item) => item.lastUpdated || item.updatedAt || item.createdAt)
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))
  const latestHealthUpdate = healthDates.length > 0
    ? new Date(healthDates[0]).toLocaleDateString()
    : null

  const improvements = improvementIndicators?.length
    ? improvementIndicators
    : [{ label: 'Set your first goal', detail: 'Add a daily check-in routine' }]

  return (
    <div className="space-y-6">
      <section className={`${cardBase} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mood</p>
            <p className="text-lg font-semibold text-slate-900">Mood trend</p>
          </div>
          <div className="rounded-2xl bg-emerald-100/70 p-2 text-emerald-700">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          {hasMoodChart ? (
            <svg
              viewBox={`0 0 ${lineDims.width} ${lineDims.height}`}
              className="h-32 w-full"
              role="img"
              aria-label="Mood trend"
            >
              <defs>
                <linearGradient id="moodLine" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4CD7B6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5B8BF5" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="moodFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4CD7B6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#5B8BF5" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#moodFill)" />
              <polyline
                fill="none"
                stroke="url(#moodLine)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={lineDims.points}
              />
            </svg>
          ) : (
            <p className="text-sm text-slate-500">Not enough mood data to chart a trend yet.</p>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent mood entries</p>
          <div className="mt-2 space-y-2">
            {recentMoodEntries.length > 0 ? recentMoodEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-semibold capitalize text-slate-700">{entry.moodLabel}</p>
                  <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {entry.moodLevel}/10
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No mood entries yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className={`${cardBase} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tracking Data</p>
            <p className="text-lg font-semibold text-slate-900">Growth progress</p>
          </div>
          <div className="rounded-2xl bg-blue-100/70 p-2 text-blue-700">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          {userGrowthData.length > 0 ? (
            <div className="flex items-end gap-3">
              {userGrowthData.map((item) => {
                const barHeight = Math.max(18, Math.round((item.score / 10) * 100))
                return (
                  <div key={item.month} className="flex-1">
                    <div className="relative h-20 rounded-full bg-white/80">
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-emerald-400 to-blue-400"
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">{item.month}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Progress bars appear after a few check-ins.</p>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Improvement path</p>
          <div className="mt-2 space-y-2">
            {improvements.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2"
              >
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${cardBase} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Health Data</p>
            <p className="text-lg font-semibold text-slate-900">Wellness snapshot</p>
          </div>
          <div className="rounded-2xl bg-amber-100/70 p-2 text-amber-700">
            <Shield className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Records</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{healthItems.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{activeConditions}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest update</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {latestHealthUpdate || 'No updates yet'}
          </p>
        </div>

        <Link
          href="/resources"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View health resources
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
