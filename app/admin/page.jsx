'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  LogOut,
  AlertCircle,
  Search,
  ChevronDown,
  LayoutDashboard,
  BarChart,
  MessageSquare,
  Settings,
  Sparkles,
  Stethoscope,
  Microscope,
  FlaskConical,
} from 'lucide-react'
import Link from 'next/link'
import UserFormModal from '@/app/components/Admin/UserFormModal'
import UsersTable from '@/app/components/Admin/UsersTable'
import Toast from '@/app/components/Admin/Toast'
import ConfirmDialog from '@/app/components/Admin/ConfirmDialog'
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/lib/api-client'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('patient')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  })
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState('checking')

  const tabs = [
    { id: 'patient', label: 'Patients', icon: Users },
    { id: 'psychiatrist', label: 'Psychiatrists', icon: Stethoscope },
    { id: 'researcher', label: 'Researchers', icon: Microscope },
    { id: 'data-scientist', label: 'Data Scientists', icon: FlaskConical },
  ]

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'users', label: 'User Management', icon: Users, href: '/admin' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, href: '/admin/analytics' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  // Check database connection on mount
  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.status === 503) {
          setDbStatus('error')
          showToast('Database connection failed. Please check your MySQL setup.', 'error')
        } else if (response.ok) {
          setDbStatus('connected')
        }
      } catch (error) {
        setDbStatus('error')
        console.error('[UI] Database status check failed:', error)
      }
    }

    checkDbStatus()
  }, [])

  // Fetch users when tab changes
  useEffect(() => {
    fetchUsers()
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      console.log('[UI] Fetching users for role:', activeTab)
      const data = await fetchAllUsers(activeTab)

      if (Array.isArray(data)) {
        setUsers(data)
        console.log('[UI] Users fetched successfully:', data.length)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('[UI] Fetch error:', error)
      showToast(error.message || 'Failed to fetch users', 'error')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const updateData = { ...formData }
        if (!updateData.password) {
          delete updateData.password
        }
        await updateUser(selectedUser.id, updateData)
        showToast('User updated successfully', 'success')
      } else {
        // Create new user
        const result = await createUser(formData)
        console.log('[UI] User created:', result)
        showToast('User created successfully', 'success')
      }
      await fetchUsers()
    } catch (error) {
      console.error('[UI] Form submit error:', error)
      showToast(error.message || 'Failed to save user', 'error')
    }
  }

  const handleDeleteClick = (userId, userName) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      userName,
    })
  }

  const handleConfirmDelete = async () => {
    setConfirmLoading(true)
    try {
      await deleteUser(confirmDialog.userId)
      showToast(`${confirmDialog.userName} has been deleted`, 'success')
      await fetchUsers()
      setConfirmDialog({ isOpen: false, userId: null, userName: '' })
    } catch (error) {
      console.error('[UI] Delete error:', error)
      showToast(error.message || 'Failed to delete user', 'error')
    } finally {
      setConfirmLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogout = () => {
    // Clear session
    document.cookie = 'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    document.cookie = 'user-data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    router.push('/auth/signin')
  }

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || 'Users'

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--dashboard-bg)' }}>
      <div className="pointer-events-none absolute -top-40 right-[-15%] h-80 w-80 rounded-full bg-[rgba(76,215,182,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-[-10%] h-96 w-96 rounded-full bg-[rgba(91,139,245,0.16)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-20%] h-96 w-96 rounded-full bg-[rgba(251,113,133,0.12)] blur-3xl" />

      <div className="hidden lg:flex w-64 bg-white/90 h-screen fixed left-0 top-0 flex-col border-r border-white/60 shadow-soft-2 backdrop-blur">
        <div className="p-6 border-b border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-soft-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900">MindCare</span>
              <p className="text-xs text-slate-500">Admin Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === 'users'

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-emerald-500 shadow-soft-2'
                    : 'text-slate-600 hover:bg-white/70'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-semibold text-slate-600 transition hover:bg-white/70"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>

        <div className="p-4">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-blue-600 to-emerald-500 shadow-soft-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold mb-1 text-center">Admin Pro</h4>
            <p className="text-white/80 text-xs mb-4 text-center">Advanced analytics and insights</p>
            <button className="w-full bg-white text-sm font-semibold py-2 px-4 rounded-lg transition-all hover:shadow-lg text-blue-700">
              Upgrade
            </button>
          </div>
        </div>
      </div>

      <div className="relative lg:ml-64">
        <div className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
              <p className="text-sm text-slate-500">Manage users, roles, and system health.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[220px] lg:min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/70 bg-white/80 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {dbStatus === 'error' && (
                <div className="flex items-center gap-2 rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700">
                  <AlertCircle size={16} />
                  DB Error
                </div>
              )}
              {dbStatus === 'connected' && (
                <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Connected
                </div>
              )}

              <button className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-xl hover:bg-white/70 transition">
                <div>
                  <div className="text-sm font-semibold text-right text-slate-900">Admin</div>
                  <div className="text-xs text-right text-slate-500">Administrator</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={handleLogout}
                className="lg:hidden rounded-xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-600">
              {users.length} users in {activeTabLabel.toLowerCase()}
            </span>
            <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-600">
              Active role: {activeTabLabel}
            </span>
            <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-600">
              Status: {dbStatus === 'connected' ? 'Healthy' : dbStatus === 'error' ? 'Attention' : 'Checking'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 rounded-2xl border border-white/70 bg-white/80 p-2 shadow-soft-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-600 to-emerald-500 shadow-soft-1'
                      : 'text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )}
            )}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/90 shadow-soft-2">
            <div className="flex flex-wrap justify-between items-center gap-4 p-6 border-b border-white/60">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{activeTabLabel}</h2>
                <p className="text-sm text-slate-500">
                  {users.length} {activeTab === 'patient' ? 'patient' : 'user'}
                  {users.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={handleAddUser}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition hover:-translate-y-0.5 font-medium bg-gradient-to-r from-blue-600 to-emerald-500 shadow-soft-2"
              >
                <Plus size={18} />
                Add {activeTab === 'patient' ? 'Patient' : activeTab === 'psychiatrist' ? 'Psychiatrist' : 'User'}
              </button>
            </div>

            <div className="p-6">
              <UsersTable
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteClick}
                isLoading={loading}
              />
            </div>
          </div>
        </main>
      </div>

      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        userType={activeTab}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDialog.userName}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, userId: null, userName: '' })}
        isLoading={confirmLoading}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
