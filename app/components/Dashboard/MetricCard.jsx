'use client'

export default function MetricCard({ title, value, change, changeLabel, icon: Icon, color = 'blue' }) {
  const palette = {
    blue: {
      surface: 'bg-blue-50',
      icon: 'bg-blue-600 text-white',
      accent: 'text-blue-600',
    },
    emerald: {
      surface: 'bg-emerald-50',
      icon: 'bg-emerald-500 text-white',
      accent: 'text-emerald-600',
    },
    amber: {
      surface: 'bg-amber-50',
      icon: 'bg-amber-500 text-white',
      accent: 'text-amber-600',
    },
    violet: {
      surface: 'bg-violet-50',
      icon: 'bg-violet-500 text-white',
      accent: 'text-violet-600',
    },
  }

  const selected = palette[color] || palette.blue

  return (
    <div className={`rounded-2xl border border-white/60 shadow-soft-2 backdrop-blur p-6 ${selected.surface}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected.icon}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1 text-slate-900">
        {value}
      </div>
      <div className="text-sm mb-2 text-slate-500">
        {title}
      </div>
      {typeof change !== 'undefined' && (
        <div className={`text-xs font-semibold ${selected.accent}`}>
          {change > 0 ? '+' : ''}{change}% {changeLabel}
        </div>
      )}
    </div>
  )}
