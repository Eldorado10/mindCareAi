'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Brain, MessageCircle, Users, Calendar, Heart } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {session.user?.name || 'User'}!
          </h1>
          <p className="text-blue-100">Ready to continue your mental wellness journey?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/chat"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI Chat</h3>
            <p className="text-gray-600 text-sm">Talk to our AI companion</p>
          </Link>

          <Link
            href="/psychiatrists"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Psychiatrists</h3>
            <p className="text-gray-600 text-sm">Find professional care</p>
          </Link>

          <Link
            href="/appointments"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Appointments</h3>
            <p className="text-gray-600 text-sm">Schedule sessions</p>
          </Link>

          <Link
            href="/resources"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition text-center"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Resources</h3>
            <p className="text-gray-600 text-sm">Mental health tools</p>
          </Link>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <div className="font-medium text-gray-900">{session.user?.name}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <div className="font-medium text-gray-900">{session.user?.email}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Signed in with</label>
              <div className="font-medium text-gray-900">Google</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}