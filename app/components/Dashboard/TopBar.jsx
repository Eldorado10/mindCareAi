'use client'

import { Search, Bell, ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function TopBar({ title = 'Dashboard', user = { name: 'Musafiq', role: 'Admin', avatar: null } }) {
  return (
    <div className="bg-white border-b h-20 flex items-center justify-between px-8" style={{ borderColor: 'var(--dashboard-border)' }}>
      {/* Title */}
      <h1 className="text-2xl font-bold" style={{ color: 'var(--dashboard-text-primary)' }}>
        {title}
      </h1>

      {/* Search and Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--dashboard-primary)' }} />
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 w-80"
            style={{ 
              borderColor: 'var(--dashboard-border)',
              color: 'var(--dashboard-text-primary)'
            }}
          />
        </div>

        {/* Language Selector */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
          <span className="text-xl">🇺🇸</span>
          <span className="text-sm font-medium" style={{ color: 'var(--dashboard-text-secondary)' }}>
            Eng (US)
          </span>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--dashboard-text-secondary)' }} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50">
          <Bell className="w-5 h-5" style={{ color: 'var(--dashboard-text-secondary)' }} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg hover:bg-gray-50">
          <div>
            <div className="text-sm font-semibold text-right" style={{ color: 'var(--dashboard-text-primary)' }}>
              {user.name}
            </div>
            <div className="text-xs text-right" style={{ color: 'var(--dashboard-text-secondary)' }}>
              {user.role}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0)}
          </div>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--dashboard-text-secondary)' }} />
        </button>
      </div>
    </div>
  )
}