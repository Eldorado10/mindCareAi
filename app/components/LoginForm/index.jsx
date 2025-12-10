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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && userInfo && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-green-700">
            <p className="font-medium">Welcome back, {userInfo.firstName}! 👋</p>
            <p className="text-sm mt-1">Role: <span className="font-semibold capitalize">{userInfo.role.replace('-', ' ')}</span></p>
            <p className="text-sm">Redirecting...</p>
          </div>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4" /> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your email"
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            {showPassword ? (
              <span className="flex items-center gap-1">
                <EyeOff className="w-4 h-4" /> Hide
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> Show
              </span>
            )}
          </button>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            disabled={loading}
          />
          <span className="text-gray-700">Remember me</span>
        </label>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
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
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Demo Credentials Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
        <div className="space-y-1 text-xs text-blue-800">
          <p><span className="font-semibold">Admin:</span> admin@example.com / password123</p>
          <p><span className="font-semibold">Patient:</span> patient@example.com / password123</p>
          <p><span className="font-semibold">Researcher:</span> researcher@example.com / password123</p>
        </div>
      </div>
    </form>
  );
}
