'use client';

import { Trash2, Edit2, Eye } from 'lucide-react';

export default function UsersTable({ users, onEdit, onDelete, isLoading = false }) {
  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      patient: 'bg-blue-100 text-blue-800',
      psychiatrist: 'bg-purple-100 text-purple-800',
      researcher: 'bg-green-100 text-green-800',
      'data-scientist': 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  {user.specialization && (
                    <p className="text-sm text-gray-500">{user.specialization}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {user.role.replace('-', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`${getStatusColor(user.isActive)} font-medium`}>
                  {user.isActive ? '✓ Active' : '✕ Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                    title="Edit user"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(user.id, user.firstName + ' ' + user.lastName)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
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
  );
}
