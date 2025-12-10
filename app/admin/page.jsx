'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, LogOut, AlertCircle } from 'lucide-react';
import UserFormModal from '@/app/components/Admin/UserFormModal';
import UsersTable from '@/app/components/Admin/UsersTable';
import Toast from '@/app/components/Admin/Toast';
import ConfirmDialog from '@/app/components/Admin/ConfirmDialog';
import {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('patient');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    userId: null,
    userName: '',
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState('checking');

  const tabs = [
    { id: 'patient', label: 'Patients', icon: '👥' },
    { id: 'psychiatrist', label: 'Psychiatrists', icon: '👨‍⚕️' },
    { id: 'researcher', label: 'Researchers', icon: '🔬' },
    { id: 'data-scientist', label: 'Data Scientists', icon: '📊' },
  ];

  // Check database connection on mount
  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.status === 503) {
          setDbStatus('error');
          showToast('⚠️ Database connection failed. Please check your MySQL setup.', 'error');
        } else if (response.ok) {
          setDbStatus('connected');
        }
      } catch (error) {
        setDbStatus('error');
        console.error('[UI] Database status check failed:', error);
      }
    };

    checkDbStatus();
  }, []);

  // Fetch users when tab changes
  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('[UI] Fetching users for role:', activeTab);
      const data = await fetchAllUsers(activeTab);
      
      if (Array.isArray(data)) {
        setUsers(data);
        console.log('[UI] Users fetched successfully:', data.length);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('[UI] Fetch error:', error);
      showToast(error.message || 'Failed to fetch users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedUser) {
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateUser(selectedUser.id, updateData);
        showToast('✅ User updated successfully', 'success');
      } else {
        // Create new user
        const result = await createUser(formData);
        console.log('[UI] User created:', result);
        showToast('✅ User created successfully', 'success');
      }
      await fetchUsers();
    } catch (error) {
      console.error('[UI] Form submit error:', error);
      showToast(error.message || 'Failed to save user', 'error');
    }
  };

  const handleDeleteClick = (userId, userName) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      userName,
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmLoading(true);
    try {
      await deleteUser(confirmDialog.userId);
      showToast(`✅ ${confirmDialog.userName} has been deleted`, 'success');
      await fetchUsers();
      setConfirmDialog({ isOpen: false, userId: null, userName: '' });
    } catch (error) {
      console.error('[UI] Delete error:', error);
      showToast(error.message || 'Failed to delete user', 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    // Clear session
    document.cookie = 'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user-data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage users and platform content</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {dbStatus === 'error' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={18} />
                <span className="text-sm font-medium text-red-700">DB Error</span>
              </div>
            )}
            {dbStatus === 'connected' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-green-700">Connected</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Controls */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                {users.length} {activeTab === 'patient' ? 'patient' : 'user'}
                {users.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={18} />
              Add {activeTab === 'patient' ? 'Patient' : activeTab === 'psychiatrist' ? 'Psychiatrist' : 'User'}
            </button>
          </div>

          {/* Users Table */}
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

      {/* Form Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        userType={activeTab}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDialog.userName}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, userId: null, userName: '' })}
        isLoading={confirmLoading}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
