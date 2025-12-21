'use client'

import { Trash2, Edit2 } from 'lucide-react'

export default function UsersTable({ users, onEdit, onDelete, isLoading = false }) {
  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-rose-100 text-rose-700',
      patient: 'bg-blue-100 text-blue-700',
      psychiatrist: 'bg-emerald-100 text-emerald-700',
      researcher: 'bg-amber-100 text-amber-700',
      'data-scientist': 'bg-slate-100 text-slate-700',
    }
    return colors[role] || 'bg-slate-100 text-slate-700'
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'text-emerald-600' : 'text-rose-600'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No users found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200/60">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-200/60 hover:bg-white/60 transition">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                  {user.specialization && (
                    <p className="text-sm text-slate-500">{user.specialization}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-600">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(user.role)}`}>
                  {user.role.replace('-', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`${getStatusColor(user.isActive)} font-semibold`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">{user.phone || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit user"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(user.id, `${user.firstName} ${user.lastName}`)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete user"
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
