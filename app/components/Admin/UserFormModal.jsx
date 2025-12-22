'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function UserFormModal({ isOpen, onClose, onSubmit, user = null, userType = 'patient' }) {
  const [formData, setFormData] = useState(user || {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: userType,
    specialization: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!user && !formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';

    if (['researcher', 'data-scientist'].includes(formData.role) && !formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required for this role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: userType,
        specialization: '',
        bio: '',
      });
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl shadow-soft-3 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/60 bg-white/60">
          <h2 className="text-xl font-bold text-slate-900">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-rose-50/80 border border-rose-200/70 rounded-xl text-rose-700">
              <AlertCircle size={18} />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                errors.firstName ? 'border-rose-400' : 'border-white/70'
              }`}
              placeholder="John"
            />
            {errors.firstName && <p className="text-rose-600 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                errors.lastName ? 'border-rose-400' : 'border-white/70'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-rose-600 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!user}
              className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 disabled:bg-white/40 ${
                errors.email ? 'border-rose-400' : 'border-white/70'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                  errors.password ? 'border-rose-400' : 'border-white/70'
                }`}
                placeholder="Create a secure password"
              />
              {errors.password && <p className="text-rose-600 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-white/70 rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                errors.role ? 'border-rose-400' : 'border-white/70'
              }`}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="patient">Patient</option>
              <option value="researcher">Researcher</option>
              <option value="data-scientist">Data Scientist</option>
            </select>
            {errors.role && <p className="text-rose-600 text-xs mt-1">{errors.role}</p>}
          </div>

          {['researcher', 'data-scientist'].includes(formData.role) && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Specialization *
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                  errors.specialization ? 'border-rose-400' : 'border-white/70'
                }`}
                placeholder="e.g., Machine Learning, Psychology"
              />
              {errors.specialization && <p className="text-rose-600 text-xs mt-1">{errors.specialization}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-white/70 rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40"
              placeholder="Brief bio..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 mc-btn mc-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 mc-btn mc-btn-primary bg-gradient-to-r from-blue-600 to-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
