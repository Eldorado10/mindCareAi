'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  Plus,
  Search,
  ChevronDown,
  Stethoscope,
  Star,
  DollarSign,
  Microscope,
  FlaskConical,
  UserCheck,
  UserX,
  Database,
} from 'lucide-react'
import UserFormModal from '@/app/components/Admin/UserFormModal'
import UsersTable from '@/app/components/Admin/UsersTable'
import PsychiatristFormModal from '@/app/components/Admin/PsychiatristFormModal'
import PsychiatristsTable from '@/app/components/Admin/PsychiatristsTable'
import Toast from '@/app/components/Admin/Toast'
import ConfirmDialog from '@/app/components/Admin/ConfirmDialog'
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchPsychiatrists,
  createPsychiatrist,
  updatePsychiatrist,
  deletePsychiatrist,
} from '@/lib/api-client'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [psychiatrists, setPsychiatrists] = useState([])
  const [psychiatristsLoading, setPsychiatristsLoading] = useState(false)
  const [isPsychiatristFormOpen, setIsPsychiatristFormOpen] = useState(false)
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    entityId: null,
    entityName: '',
    entityType: 'user',
  })
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState('checking')

  const tabs = [
    { id: 'all', label: 'All Users', icon: Users },
    { id: 'patient', label: 'Patients', icon: Users },
    { id: 'researcher', label: 'Researchers', icon: Microscope },
    { id: 'data-scientist', label: 'Data Scientists', icon: FlaskConical },
    { id: 'psychiatrist', label: 'Psychiatrists', icon: Stethoscope },
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
    if (activeTab === 'psychiatrist') {
      fetchPsychiatristsList()
    } else {
      fetchUsers()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const roleFilter = activeTab === 'all' ? null : activeTab
      console.log('[UI] Fetching users for role:', roleFilter)
      const data = await fetchAllUsers(roleFilter)

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
      setUsersLoading(false)
    }
  }

  const fetchPsychiatristsList = async () => {
    setPsychiatristsLoading(true)
    try {
      const data = await fetchPsychiatrists()
      if (Array.isArray(data)) {
        setPsychiatrists(data)
      } else if (data?.error) {
        throw new Error(data.error)
      } else {
        setPsychiatrists([])
      }
    } catch (error) {
      console.error('[UI] Fetch psychiatrists error:', error)
      showToast(error.message || 'Failed to fetch psychiatrists', 'error')
      setPsychiatrists([])
    } finally {
      setPsychiatristsLoading(false)
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsUserFormOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsUserFormOpen(true)
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

  const handleAddPsychiatrist = () => {
    setSelectedPsychiatrist(null)
    setIsPsychiatristFormOpen(true)
  }

  const handleEditPsychiatrist = (psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist)
    setIsPsychiatristFormOpen(true)
  }

  const handlePsychiatristSubmit = async (formData) => {
    try {
      if (selectedPsychiatrist) {
        await updatePsychiatrist(selectedPsychiatrist.id, formData)
        showToast('Psychiatrist updated successfully', 'success')
      } else {
        const result = await createPsychiatrist(formData)
        console.log('[UI] Psychiatrist created:', result)
        showToast('Psychiatrist created successfully', 'success')
      }
      await fetchPsychiatristsList()
    } catch (error) {
      console.error('[UI] Psychiatrist submit error:', error)
      showToast(error.message || 'Failed to save psychiatrist', 'error')
    }
  }

  const handleDeleteClick = (entityId, entityName, entityType = 'user') => {
    setConfirmDialog({
      isOpen: true,
      entityId,
      entityName,
      entityType,
    })
  }

  const handleConfirmDelete = async () => {
    setConfirmLoading(true)
    try {
      if (confirmDialog.entityType === 'psychiatrist') {
        await deletePsychiatrist(confirmDialog.entityId)
        showToast(`${confirmDialog.entityName} has been deleted`, 'success')
        await fetchPsychiatristsList()
      } else {
        await deleteUser(confirmDialog.entityId)
        showToast(`${confirmDialog.entityName} has been deleted`, 'success')
        await fetchUsers()
      }
      setConfirmDialog({ isOpen: false, entityId: null, entityName: '', entityType: 'user' })
    } catch (error) {
      console.error('[UI] Delete error:', error)
      showToast(error.message || 'Failed to delete item', 'error')
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

  const isPsychiatristTab = activeTab === 'psychiatrist'
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || 'Users'
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter((user) => {
      const haystack = [
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.specialization,
        user.role,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [users, searchQuery])
  const filteredPsychiatrists = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return psychiatrists
    return psychiatrists.filter((psychiatrist) => {
      const haystack = [
        psychiatrist.name,
        psychiatrist.specialization,
        psychiatrist.bio,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [psychiatrists, searchQuery])
  const isFiltering = searchQuery.trim().length > 0
  const activeCount = users.filter((user) => user.isActive).length
  const inactiveCount = users.length - activeCount
  const psychiatristStats = useMemo(() => {
    const ratings = psychiatrists
      .map((psychiatrist) => Number(psychiatrist.rating))
      .filter((value) => Number.isFinite(value))
    const fees = psychiatrists
      .map((psychiatrist) => Number(psychiatrist.consultationFee))
      .filter((value) => Number.isFinite(value))
    const average = (values) =>
      values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

    return {
      averageRating: average(ratings),
      averageFee: average(fees),
    }
  }, [psychiatrists])
  const totalCount = isPsychiatristTab ? psychiatrists.length : users.length
  const filteredCount = isPsychiatristTab ? filteredPsychiatrists.length : filteredUsers.length
  const dbStatusLabel =
    dbStatus === 'connected' ? 'Connected' : dbStatus === 'error' ? 'Attention' : 'Checking'
  const dbStatusBadge =
    dbStatus === 'connected'
      ? 'badge badge-success'
      : dbStatus === 'error'
        ? 'badge badge-error'
        : 'badge badge-warning'
  const searchPlaceholder = isPsychiatristTab
    ? 'Search psychiatrists...'
    : 'Search name, email, phone...'
  const tableEntityLabel = isPsychiatristTab
    ? 'psychiatrist'
    : activeTab === 'patient'
      ? 'patient'
      : 'user'
  const totalSubtitle = activeTab === 'all' ? 'Users in system' : 'Users assigned to this role'
  const addButtonLabel = isPsychiatristTab
    ? 'Psychiatrist'
    : activeTab === 'patient'
      ? 'Patient'
      : activeTab === 'researcher'
        ? 'Researcher'
        : activeTab === 'data-scientist'
          ? 'Data Scientist'
          : 'User'

  return (
    <div
      className="relative min-h-screen overflow-hidden text-[var(--dashboard-text-primary)]"
      style={{ background: 'var(--dashboard-bg)' }}
    >
      <div className="pointer-events-none absolute -top-40 right-[-15%] h-80 w-80 rounded-full bg-[rgba(76,215,182,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute top-32 left-[-10%] h-96 w-96 rounded-full bg-[rgba(91,139,245,0.16)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-20%] h-96 w-96 rounded-full bg-[rgba(251,113,133,0.12)] blur-3xl" />

      <div className="relative">
        <div className="sticky top-4 z-20 px-4 sm:px-6 lg:px-8">
          <div className="mc-topbar rounded-3xl">
            <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
                <p className="text-sm text-slate-500">Manage users, roles, and system health.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 min-w-[220px] lg:min-w-[280px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setSearchQuery('')
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-white/70 bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-2xl border border-white/70 bg-white/70 shadow-soft-1 transition hover:shadow-soft-2">
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
                  className="lg:hidden rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft-1"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          {isPsychiatristTab ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Psychiatrists</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
                  <p className="text-sm text-slate-500">Registered specialists</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg Rating</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">
                    {psychiatristStats.averageRating ? psychiatristStats.averageRating.toFixed(1) : '0.0'}
                  </p>
                  <p className="text-sm text-slate-500">Across listed psychiatrists</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg Fee</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">
                    {psychiatristStats.averageFee ? `$${psychiatristStats.averageFee.toFixed(2)}` : '$0.00'}
                  </p>
                  <p className="text-sm text-slate-500">Average consultation fee</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Database</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-slate-900">Status</p>
                  <span className={dbStatusBadge}>{dbStatusLabel}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total {activeTabLabel}</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
                  <p className="text-sm text-slate-500">{totalSubtitle}</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Users</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
                  <p className="text-sm text-slate-500">Currently active</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inactive Users</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                    <UserX className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{inactiveCount}</p>
                  <p className="text-sm text-slate-500">Needs attention</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Database</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-slate-900">Status</p>
                  <span className={dbStatusBadge}>{dbStatusLabel}</span>
                </div>
              </div>
            </div>
          )}

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

          <div className="glass rounded-3xl overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-4 p-6 border-b border-white/60">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{activeTabLabel}</h2>
                <p className="text-sm text-slate-500">
                  {isFiltering ? `${filteredCount} of ${totalCount}` : totalCount}{' '}
                  {tableEntityLabel}
                  {filteredCount !== 1 ? 's' : ''} found
                </p>
              </div>
              <button
                onClick={isPsychiatristTab ? handleAddPsychiatrist : handleAddUser}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl transition hover:-translate-y-0.5 font-medium bg-gradient-to-r from-blue-600 to-emerald-500 shadow-soft-2"
              >
                <Plus size={18} />
                Add {addButtonLabel}
              </button>
            </div>

            <div className="p-6">
              {isPsychiatristTab ? (
                <PsychiatristsTable
                  psychiatrists={filteredPsychiatrists}
                  onEdit={handleEditPsychiatrist}
                  onDelete={(id, name) => handleDeleteClick(id, name, 'psychiatrist')}
                  isLoading={psychiatristsLoading}
                  emptyMessage={isFiltering ? 'No matches for this search' : 'No psychiatrists found'}
                />
              ) : (
                <UsersTable
                  users={filteredUsers}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteClick}
                  isLoading={usersLoading}
                  emptyMessage={isFiltering ? 'No matches for this search' : 'No users found'}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {!isPsychiatristTab && (
        <UserFormModal
          isOpen={isUserFormOpen}
          onClose={() => {
            setIsUserFormOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={handleFormSubmit}
          user={selectedUser}
          userType={activeTab === 'all' ? 'patient' : activeTab}
        />
      )}

      {isPsychiatristTab && (
        <PsychiatristFormModal
          isOpen={isPsychiatristFormOpen}
          onClose={() => {
            setIsPsychiatristFormOpen(false)
            setSelectedPsychiatrist(null)
          }}
          onSubmit={handlePsychiatristSubmit}
          psychiatrist={selectedPsychiatrist}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.entityType === 'psychiatrist' ? 'Delete Psychiatrist' : 'Delete User'}
        message={`Are you sure you want to delete ${confirmDialog.entityName}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, entityId: null, entityName: '', entityType: 'user' })}
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
