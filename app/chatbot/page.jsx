'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatBot from '@/app/components/ChatBot'

export default function ChatBotPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Chat with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">MindCare AI</span>
            </h1>
            <p className="text-xl text-gray-600">
              Get instant support and guidance from our AI companion, available 24/7
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  )
}
