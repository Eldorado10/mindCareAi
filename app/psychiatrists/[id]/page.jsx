'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Star, MapPin, Briefcase, DollarSign, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import BookingForm from '@/app/components/BookingForm'

export default function PsychiatristDetail() {
  const params = useParams()
  const router = useRouter()
  const [psychiatrist, setPsychiatrist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setIsAuthenticated(true)
    setAuthLoading(false)
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    async function fetchPsychiatrist() {
      try {
        setLoading(true)
        const response = await fetch(`/api/psychiatrists?id=${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch psychiatrist')
        const data = await response.json()
        setPsychiatrist(data)
      } catch (err) {
        console.error(err)
        setError('Psychiatrist not found')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPsychiatrist()
    }
  }, [params.id, isAuthenticated])

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Return null if not authenticated (router will redirect to signin)
  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading psychiatrist details...</p>
        </div>
      </div>
    )
  }

  if (error || !psychiatrist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/psychiatrists" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to Psychiatrists
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">{error || 'Psychiatrist not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/psychiatrists" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Psychiatrists
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>

              {/* Content */}
              <div className="px-8 pb-8">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row gap-6 -mt-20 mb-8 relative z-10">
                  {psychiatrist.imageUrl && (
                    <img
                      src={psychiatrist.imageUrl}
                      alt={psychiatrist.name}
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{psychiatrist.name}</h1>
                    <p className="text-lg text-blue-600 font-semibold mb-4">{psychiatrist.specialization}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(psychiatrist.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold">{psychiatrist.rating?.toFixed(1) || 'N/A'}</span>
                    </div>

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <span>{psychiatrist.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span>${psychiatrist.consultationFee}/session</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{psychiatrist.bio}</p>
                </div>

                {/* Availability */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Availability
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-gray-700">{psychiatrist.availability || 'Mon - Fri: 9:00 AM - 5:00 PM'}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {(psychiatrist.specialization || '').split(',').map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {specialty.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            {psychiatrist && (
              <div className="sticky top-20">
                <BookingForm
                  psychiatristId={psychiatrist.id}
                  psychiatristName={psychiatrist.name}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}