'use client'

import { Trash2, Edit2 } from 'lucide-react'

const isEmptyValue = (value) => value === null || value === undefined || value === ''

const formatNumber = (value, digits = 0) => {
  if (isEmptyValue(value)) return '-'
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue.toFixed(digits) : '-'
}

const formatExperience = (value) => {
  if (isEmptyValue(value)) return '-'
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? `${numberValue} yrs` : '-'
}

const formatFee = (value) => {
  if (isEmptyValue(value)) return '-'
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? `$${numberValue.toFixed(2)}` : '-'
}

export default function PsychiatristsTable({
  psychiatrists,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = 'No psychiatrists found',
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (psychiatrists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-white/70 border-b border-white/60">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Specialization</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Experience</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Fee</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {psychiatrists.map((psychiatrist) => (
            <tr key={psychiatrist.id} className="border-b border-white/60 hover:bg-white/60 transition">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-900">{psychiatrist.name}</p>
                  {psychiatrist.bio && (
                    <p className="text-sm text-slate-500">{psychiatrist.bio}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">{psychiatrist.specialization || '-'}</td>
              <td className="px-6 py-4 text-slate-600">{formatExperience(psychiatrist.experience)}</td>
              <td className="px-6 py-4 text-slate-600">{formatNumber(psychiatrist.rating, 1)}</td>
              <td className="px-6 py-4 text-slate-600">{formatFee(psychiatrist.consultationFee)}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(psychiatrist)}
                    className="p-2 text-blue-600 bg-white/70 border border-white/60 hover:bg-blue-50 rounded-lg transition shadow-soft-1"
                    title="Edit psychiatrist"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(psychiatrist.id, psychiatrist.name)}
                    className="p-2 text-rose-600 bg-white/70 border border-white/60 hover:bg-rose-50 rounded-lg transition shadow-soft-1"
                    title="Delete psychiatrist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
