'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Brain, Shield, Sparkles, Users, Heart } from 'lucide-react'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Welcome */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MindCare AI</h1>
                <p className="text-gray-600">Mental Health Companion</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Your Mental Wellness Journey
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">AI-Powered Support</h3>
                  <p className="text-gray-600">Get instant help from our AI companion</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Professional Care</h3>
                  <p className="text-gray-600">Connect with licensed psychiatrists</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Complete Privacy</h3>
                  <p className="text-gray-600">Your data is secure and confidential</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Sign In */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl">
            <div className="h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">Get Started</h2>
                <p className="text-blue-100">One-click sign in with Google</p>
              </div>

              <button
                onClick=
                {handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="mt-8 text-center">
                <p className="text-blue-200 text-sm">
                  By signing in, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}