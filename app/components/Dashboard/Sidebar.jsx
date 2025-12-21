'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HeartPulse, LineChart as LineChartIcon, Activity } from 'lucide-react'

export default function Sidebar({ chartData = [], maxMood = 10, lineDims, userGrowthData = [], moodEntries = [], healthData = [] }) {
  const sectionBase = 'rounded-3xl border border-white/70 bg-white/90 shadow-soft-2 backdrop-blur p-5 space-y-4'
  const panelBase = 'rounded-2xl border border-white/60 bg-white/80'
  const safeLineDims = lineDims || { width: 360, height: 160, margin: 20, step: 0, yScale: 1, points: '' }

  return (
    <aside className="space-y-5 lg:sticky lg:top-6">
      <div className={sectionBase}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-2 text-blue-600">
            <LineChartIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mood</p>
            <p className="text-lg font-semibold text-slate-900">Trend & Entries</p>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className={`${panelBase} p-3`}>
            <div className="flex items-end gap-2 h-44">
              {chartData.map((data) => {
                const heightPercent = (data.mood / maxMood) * 100
                return (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex justify-center">
                      <div
                        className="w-7 bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-emerald-500 cursor-pointer group relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100 whitespace-nowrap">
                          Day {data.day}: {data.mood}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">D{data.day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No mood data yet.</p>
        )}

        <div className="space-y-2">
          {moodEntries.slice(0, 3).map((entry) => (
            <div key={entry.id} className={`${panelBase} p-3 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  entry.moodLevel >= 8
                    ? 'bg-emerald-500'
                    : entry.moodLevel >= 5
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}>
                  {entry.moodLevel}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 capitalize leading-tight">{entry.moodLabel}</p>
                  <p className="text-[11px] text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
              {entry.improvement && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  {entry.improvement}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={sectionBase}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tracking Data</p>
            <p className="text-lg font-semibold text-slate-900">Growth & Improvement</p>
          </div>
        </div>

        {userGrowthData.length > 0 ? (
          <div className={`${panelBase} p-3`}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsersSidebar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CD7B6" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#4CD7B6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorUsersSidebar)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No growth data yet.</p>
        )}

        {chartData.length > 1 ? (
          <div className={`${panelBase} p-3`}>
            <svg
              viewBox={`0 0 ${safeLineDims.width} ${safeLineDims.height}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-40 rounded-2xl bg-white/70"
            >
              <polyline
                points={safeLineDims.points}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              {chartData.map((d, i) => {
                const x = safeLineDims.margin + i * safeLineDims.step
                const y = safeLineDims.height - safeLineDims.margin - d.mood * safeLineDims.yScale
                return <circle key={i} cx={x} cy={y} r="4" fill="#10b981" />
              })}
            </svg>
            <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-1">
              <span>Start</span>
              <span>Today</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Add more entries to see your improvement path.</p>
        )}
      </div>

      <div className={sectionBase}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rose-500/10 p-2 text-rose-600">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Health Data</p>
            <p className="text-lg font-semibold text-slate-900">Conditions</p>
          </div>
        </div>

        {healthData.length > 0 ? (
          <div className="space-y-3">
            {healthData.slice(0, 4).map((health) => (
              <div key={health.id} className={`${panelBase} p-3`}> 
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{health.condition}</p>
                    <p className="text-[11px] text-slate-500">Status: <span className="font-medium capitalize text-slate-700">{health.status}</span></p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                    health.severity === 'severe'
                      ? 'bg-rose-100 text-rose-700'
                      : health.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {health.severity}
                  </span>
                </div>
                {health.description && (
                  <p className="text-sm text-slate-600 mt-2">{health.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No health conditions recorded yet.</p>
        )}
      </div>
    </aside>
  )
}
