import { Suspense } from 'react';
import Link from 'next/link';
import LoginForm from '@/app/components/LoginForm';
import { Brain, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Sign In - MindCare AI',
  description: 'Sign in to your MindCare AI account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700">
            <Brain className="w-8 h-8" />
            MindCare AI
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              Sign Up <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features/Info */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome Back
                </h1>
                <p className="text-xl text-gray-600">
                  Sign in to access your MindCare AI account and continue your mental health journey.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">AI-Powered Support</h3>
                    <p className="text-gray-600 text-sm">24/7 empathetic mental health companion</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Track Your Progress</h3>
                    <p className="text-gray-600 text-sm">Monitor mood patterns and mental health insights</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                      <span className="text-2xl">🔒</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Your Privacy Matters</h3>
                    <p className="text-gray-600 text-sm">HIPAA-compliant and end-to-end encrypted</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personalized Resources</h3>
                    <p className="text-gray-600 text-sm">Access curated coping strategies and exercises</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-4 font-medium">Trusted by mental health professionals</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">10k+</p>
                    <p className="text-xs text-gray-600">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">500+</p>
                    <p className="text-xs text-gray-600">Sessions Daily</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">4.9★</p>
                    <p className="text-xs text-gray-600">User Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
            </div>

            <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
              <LoginForm />
            </Suspense>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Need help? Contact our support team at support@mindcareai.com</p>
        </div>
      </div>
    </div>
  );
}
