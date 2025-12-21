'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'

export default function EmergencyDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window === 'undefined') return
        const stored = localStorage.getItem('user')
        if (!stored) { router.replace('/auth/signin'); return }
        const u = JSON.parse(stored)
        setUser(u)
        if (u.role !== 'admin') { router.replace('/dashboard'); return }
        await loadAlerts()
        setLoading(false)
      } catch (e) {
        console.error(e)
        setError('Failed to load emergency dashboard')
        setLoading(false)
      }
    }
    init()
  }, [router])

  async function loadAlerts() {
    try {
      const res = await fetch('/api/chatbot/tracking')
      if (!res.ok) throw new Error('Failed to fetch alerts')
      const data = await res.json()
      setAlerts(data.alerts || [])
    } catch (e) {
      console.error(e)
      setError('Failed to fetch alerts')
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch('/api/chatbot/tracking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (!res.ok) throw new Error('Failed to update status')
      await loadAlerts()
    } catch (e) {
      console.error(e)
      setError('Failed to update status')
    }
  }

  const badge = (level) => {
    switch(level) {
      case 'high': return 'bg-red-500/20 text-red-300'
      case 'critical': return 'bg-red-600/20 text-red-200'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300'
      default: return 'bg-green-500/20 text-green-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] flex items-center justify-center text-white">Loading emergency dashboard...</div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b1020]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400" /> Emergency Alerts
          </h1>
          <button onClick={loadAlerts} className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20">Refresh</button>
        </div>

        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

        {alerts.length === 0 ? (
          <div className="text-slate-300">No emergency alerts.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className="rounded-xl bg-[#0f1631] ring-1 ring-white/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${badge(a.riskLevel)}`}>{a.riskLevel}</span>
                      {a.isHeavy && <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">heavy</span>}
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(a.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 text-white/90 text-sm">User #{a.userId}</div>
                    <div className="mt-2 text-slate-300 text-sm">
                      <span className="font-semibold text-white/90">Excerpt:</span> {a.excerpt}
                    </div>
                    <details className="mt-2">
                      <summary className="text-slate-400 text-xs cursor-pointer">View full message</summary>
                      <div className="mt-2 text-slate-200 text-sm whitespace-pre-wrap">{a.fullText}</div>
                    </details>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <span className="text-xs text-slate-400">Status: <span className="capitalize text-white/90">{a.status}</span></span>
                    <button onClick={() => updateStatus(a.id, 'acknowledged')} className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-500">Acknowledge</button>
                    <button onClick={() => updateStatus(a.id, 'resolved')} className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
