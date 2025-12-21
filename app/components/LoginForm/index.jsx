'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api-client';
import { Mail, Lock, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const inputBase = 'w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition disabled:cursor-not-allowed disabled:opacity-60';
  const inputWithIcon = `${inputBase} pl-11`;
  const inputWithIconAction = `${inputBase} pl-11 pr-12`;

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
      if (!formData.email.includes('@')) {
        throw new Error('Valid email is required');
      }
      if (!formData.password) {
        throw new Error('Password is required');
      }

      // Login
      const user = await login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      setUserInfo(user);
      setSuccess(true);

      // Store user data in localStorage and cookies
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      
      // Store user data in cookie for middleware to verify admin role
      document.cookie = `user-data=${encodeURIComponent(JSON.stringify({ id: user.id, role: user.role }))};path=/`;
      document.cookie = 'next-auth.session-token=session;path=/';

      setFormData({
        email: '',
        password: '',
      });

      // Redirect based on role
      const roleRedirects = {
        admin: '/admin',
        researcher: '/dashboard?role=researcher',
        'data-scientist': '/dashboard?role=data-scientist',
        patient: '/dashboard?role=patient',
      };
      
      setTimeout(() => {
        router.push(roleRedirects[user.role] || '/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Alert Messages */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && userInfo && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 shadow-sm">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Welcome back, {userInfo.firstName || 'there'}!</p>
              <p className="mt-1">Role: <span className="font-semibold capitalize">{userInfo.role.replace('-', ' ')}</span></p>
              <p>Redirecting...</p>
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-neutral-800">
          Email
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
            placeholder="you@mindcareai.com"
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-neutral-800">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition"
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={inputWithIconAction}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-neutral-600">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 accent-primary"
            disabled={loading}
          />
          <span>Remember me</span>
        </label>
        <a href="/auth/forgot-password" className="font-semibold text-primary hover:text-primary/80 transition">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white font-semibold shadow-soft-2 transition hover:shadow-soft-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Sign In
            </>
          )}
        </span>
        <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100"></span>
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-[0.2em]">
          <span className="bg-white px-3 text-neutral-400">Demo Access</span>
        </div>
      </div>

      {/* Demo Credentials Info */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-neutral-700">
        <p className="font-semibold text-primary">Demo credentials</p>
        <div className="mt-3 space-y-2 text-xs text-neutral-600">
          <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 shadow-sm">
            <span className="font-semibold text-neutral-800">Admin</span>
            <span className="text-neutral-500">admin@example.com / password123</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 shadow-sm">
            <span className="font-semibold text-neutral-800">Patient</span>
            <span className="text-neutral-500">patient@example.com / password123</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 shadow-sm">
            <span className="font-semibold text-neutral-800">Researcher</span>
            <span className="text-neutral-500">researcher@example.com / password123</span>
          </div>
        </div>
      </div>
    </form>
  );
}
