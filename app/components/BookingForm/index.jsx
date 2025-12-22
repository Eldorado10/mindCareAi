'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBooking, fetchUserProfile } from '@/lib/api-client'
import { Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle, LogIn } from 'lucide-react'

export default function BookingForm({
  psychiatristId,
  psychiatristName,
  bookingType = 'video',
  initialDate = '',
  initialTimeSlot = '10:00 AM',
  onDateChange,
  onTimeChange
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    phoneNumber: '',
    bookingDate: initialDate,
    timeSlot: initialTimeSlot,
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const minBookingDate = (() => {
    const today = new Date()
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    return today.toISOString().split('T')[0]
  })()

  // Check authentication on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setAuthLoading(false)
      return
    }
    
    const user = localStorage.getItem('user')
    if (!user) {
      setIsAuthenticated(false)
      setAuthLoading(false)
      return
    }

    let parsedUser = null
    try {
      parsedUser = JSON.parse(user)
    } catch (error) {
      console.error('Error parsing user data:', error)
      setIsAuthenticated(false)
      setAuthLoading(false)
      return
    }

    setIsAuthenticated(true)
    setAuthLoading(false)

    const fallbackName = [parsedUser.firstName, parsedUser.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()

    setFormData((prev) => ({
      ...prev,
      userName: prev.userName || fallbackName,
      userEmail: prev.userEmail || parsedUser.email || '',
      phoneNumber: prev.phoneNumber || parsedUser.phone || '',
    }))

    const userId = parsedUser.id
    const userEmail = parsedUser.email

    if (!userId && !userEmail) return

    let isActive = true
    const loadProfile = async () => {
      setProfileLoading(true)
      const profile = await fetchUserProfile({ id: userId, email: userEmail })
      if (!isActive) return
      if (profile) {
        const fullName = [profile.firstName, profile.lastName]
          .filter(Boolean)
          .join(' ')
          .trim()
        setFormData((prev) => ({
          ...prev,
          userName: prev.userName || fullName,
          userEmail: prev.userEmail || profile.email || userEmail || '',
          phoneNumber: prev.phoneNumber || profile.phone || '',
        }))
      }
      setProfileLoading(false)
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    setFormData((prev) => {
      const nextDate = initialDate ?? ''
      const nextTime = initialTimeSlot ?? '10:00 AM'
      if (prev.bookingDate === nextDate && prev.timeSlot === nextTime) {
        return prev
      }
      return {
        ...prev,
        bookingDate: nextDate,
        timeSlot: nextTime,
      }
    })
  }, [initialDate, initialTimeSlot])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === 'bookingDate') {
      onDateChange?.(value)
    }
    if (name === 'timeSlot') {
      onTimeChange?.(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate form
      if (!formData.userName || !formData.userEmail || !formData.bookingDate) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      const booking = await createBooking({
        psychiatristId,
        userEmail: formData.userEmail,
        phoneNumber: formData.phoneNumber,
        bookingDate: new Date(formData.bookingDate).toISOString(),
        timeSlot: formData.timeSlot,
        status: 'pending'
      })

      if (booking) {
        setSuccess(true)
        setFormData({
          userName: '',
          userEmail: '',
          phoneNumber: '',
          bookingDate: initialDate,
          timeSlot: initialTimeSlot,
          notes: '',
        })
        onDateChange?.(initialDate)
        onTimeChange?.(initialTimeSlot)
        // Reset success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err) {
      setError(err?.message || 'Failed to create booking. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-8">
            Please log in to your account to book an appointment with <span className="font-semibold text-blue-600">{psychiatristName}</span>
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
          <p className="text-gray-600 text-sm mt-6">
            Don't have an account? <button onClick={() => router.push('/auth/signup')} className="text-blue-600 hover:underline font-semibold">Create one</button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-lg text-neutral-800">
      <h3 className="text-2xl font-bold text-neutral-900 mb-2">Book an Appointment</h3>
      <p className="text-sm text-neutral-500 mb-6">
        with <span className="font-semibold text-blue-600">{psychiatristName}</span>
      </p>

      {profileLoading && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Loading your saved details...
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Booking Confirmed!</h4>
            <p className="text-green-700 text-sm">Your appointment has been scheduled. You'll receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </div>
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </div>
          </label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </div>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Preferred Date *
            </div>
          </label>
          <input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
            required
            min={minBookingDate}
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Preferred Time
            </div>
          </label>
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
          >
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="5:00 PM">5:00 PM</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tell us about your concerns or questions..."
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-semibold text-white shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Booking...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Confirm Booking
            </>
          )}
        </button>

        <p className="text-neutral-500 text-sm text-center">
          We'll send a confirmation email with appointment details
        </p>
      </form>
    </div>
  )
}
