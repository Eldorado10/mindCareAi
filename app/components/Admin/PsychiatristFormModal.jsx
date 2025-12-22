'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const emptyState = {
  name: '',
  specialization: '',
  experience: '',
  rating: '',
  consultationFee: '',
  bio: '',
};

export default function PsychiatristFormModal({
  isOpen,
  onClose,
  onSubmit,
  psychiatrist = null,
}) {
  const [formData, setFormData] = useState(emptyState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (psychiatrist) {
      setFormData({
        name: psychiatrist.name || '',
        specialization: psychiatrist.specialization || '',
        experience: psychiatrist.experience ?? '',
        rating: psychiatrist.rating ?? '',
        consultationFee: psychiatrist.consultationFee ?? '',
        bio: psychiatrist.bio || '',
      });
    } else {
      setFormData(emptyState);
    }
    setErrors({});
  }, [psychiatrist, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';

    if (formData.experience && Number.isNaN(Number(formData.experience))) {
      newErrors.experience = 'Experience must be a number';
    }
    if (formData.rating && Number.isNaN(Number(formData.rating))) {
      newErrors.rating = 'Rating must be a number';
    }
    if (formData.consultationFee && Number.isNaN(Number(formData.consultationFee))) {
      newErrors.consultationFee = 'Fee must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      specialization: formData.specialization.trim(),
      bio: formData.bio.trim() || null,
    };

    if (formData.experience !== '') payload.experience = Number(formData.experience);
    if (formData.rating !== '') payload.rating = Number(formData.rating);
    if (formData.consultationFee !== '') payload.consultationFee = Number(formData.consultationFee);

    setLoading(true);
    try {
      await onSubmit(payload);
      setFormData(emptyState);
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
            {psychiatrist ? 'Edit Psychiatrist' : 'Add Psychiatrist'}
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
              placeholder="Dr. Jane Doe"
            />
            {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
          </div>

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
              placeholder="Anxiety Disorders"
            />
            {errors.specialization && (
              <p className="text-rose-600 text-xs mt-1">{errors.specialization}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Experience (yrs)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                  errors.experience ? 'border-rose-400' : 'border-white/70'
                }`}
                placeholder="8"
                min="0"
              />
              {errors.experience && (
                <p className="text-rose-600 text-xs mt-1">{errors.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                  errors.rating ? 'border-rose-400' : 'border-white/70'
                }`}
                placeholder="4.8"
                step="0.1"
                min="0"
                max="5"
              />
              {errors.rating && <p className="text-rose-600 text-xs mt-1">{errors.rating}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Fee
              </label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white/70 text-slate-700 shadow-soft-1 outline-none transition focus:ring-2 focus:ring-blue-500/40 ${
                  errors.consultationFee ? 'border-rose-400' : 'border-white/70'
                }`}
                placeholder="150"
                step="0.01"
                min="0"
              />
              {errors.consultationFee && (
                <p className="text-rose-600 text-xs mt-1">{errors.consultationFee}</p>
              )}
            </div>
          </div>

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
              {loading ? 'Saving...' : psychiatrist ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
