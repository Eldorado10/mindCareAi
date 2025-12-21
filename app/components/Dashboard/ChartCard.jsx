'use client'

export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft-2 backdrop-blur">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {action && (
          <button className="text-sm font-semibold px-4 py-2 rounded-xl border border-white/70 bg-white/80 text-slate-600 hover:-translate-y-0.5 transition shadow-soft-1">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
