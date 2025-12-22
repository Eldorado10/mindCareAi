'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'

const emptyState = {
  id: null,
  name: '',
  email: '',
  phone: '',
  region: 'Bangladesh',
  isActive: true,
}

export default function EmergencyTeamForm({ team, onSubmit, isSaving = false }) {
  const [formData, setFormData] = useState(emptyState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (team) {
      setFormData({
        id: team.id ?? null,
        name: team.name || '',
        email: team.email || '',
        phone: team.phone || '',
        region: team.region || 'Bangladesh',
        isActive: team.isActive !== false,
      })
    } else {
      setFormData(emptyState)
    }
    setErrors({})
  }, [team])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (!formData.email.trim()) nextErrors.email = 'Email is required'
    if (!formData.phone.trim()) nextErrors.phone = 'Phone is required'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    const payload = {
      id: formData.id,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      region: formData.region.trim() || 'Bangladesh',
      isActive: formData.isActive,
    }

    try {
      await onSubmit(payload)
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="flex items-center gap-2 p-3 bg-rose-50/80 border border-rose-200/70 rounded-xl text-rose-700">
          <AlertCircle size={18} />
          <span className="text-sm">{errors.submit}</span>
        </div>
      )}

      {formData.id && (
        <div className="text-xs text-slate-500">
          Emergency Team ID: <span className="font-semibold text-slate-700">{formData.id}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
              errors.name ? 'border-rose-400' : 'border-white/70'
            }`}
            placeholder="Emergency Team Bangladesh"
          />
          {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Region
          </label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-white/70 rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40"
            placeholder="Bangladesh"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
              errors.email ? 'border-rose-400' : 'border-white/70'
            }`}
            placeholder="emergency@mindcare.ai"
          />
          {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Contact Number *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
              errors.phone ? 'border-rose-400' : 'border-white/70'
            }`}
            placeholder="+8801871535267"
          />
          {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Set as active emergency team
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="mc-btn mc-btn-primary bg-gradient-to-r from-blue-600 to-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Emergency Team'}
        </button>
      </div>
    </form>
  )
}
