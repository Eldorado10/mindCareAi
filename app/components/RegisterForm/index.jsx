'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api-client';
import Toast from '@/app/components/Admin/Toast';
import { User, Mail, Lock, Phone, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const inputBase = 'w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:cursor-not-allowed disabled:opacity-60';
  const inputWithIcon = `${inputBase} pl-11`;
  const inputWithIconAction = `${inputBase} pl-11 pr-12`;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validation
      if (!formData.firstName.trim()) {
        throw new Error('First name is required');
      }
      if (!formData.lastName.trim()) {
        throw new Error('Last name is required');
      }
      if (!formData.email.includes('@')) {
        throw new Error('Valid email is required');
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Register user
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone || null,
      };

      const registeredUser = await register(userData);
      const role = registeredUser?.role || 'patient';
      const userPayload = { ...registeredUser, role };

      localStorage.setItem('user', JSON.stringify(userPayload));
      localStorage.setItem('userRole', role);
      if (userPayload?.id) {
        document.cookie = `user-data=${encodeURIComponent(JSON.stringify({ id: userPayload.id, role }))};path=/`;
      }
      document.cookie = 'next-auth.session-token=session;path=/';

      setSuccess(true);
      showToast('Welcome to MindCare AI. Redirecting to home...', 'success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Alert Messages */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 shadow-sm">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="font-semibold text-emerald-900">Registration successful! Redirecting...</p>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-semibold text-neutral-800">
            First name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputWithIcon}
              placeholder="John"
              autoComplete="given-name"
              disabled={loading}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-semibold text-neutral-800">
            Last name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputWithIcon}
              placeholder="Doe"
              autoComplete="family-name"
              disabled={loading}
              required
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-neutral-800">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputWithIcon}
            placeholder="john@example.com"
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* Phone (optional) */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-neutral-800">
          Phone (optional)
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputWithIcon}
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
            disabled={loading}
          />
        </div>
      </div>

      {/* Password Fields */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-neutral-800">
          Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={inputWithIconAction}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            aria-describedby="password-hint"
            minLength={6}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition"
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show
              </>
            )}
          </button>
        </div>
        <p id="password-hint" className="text-xs text-neutral-500">Use at least 6 characters.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-800">
          Confirm password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputWithIconAction}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition"
            disabled={loading}
            aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
          >
            {showConfirmPassword ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show
              </>
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white font-semibold shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              Create Account
            </>
          )}
        </span>
        <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100"></span>
      </button>
    </form>
  );
}
