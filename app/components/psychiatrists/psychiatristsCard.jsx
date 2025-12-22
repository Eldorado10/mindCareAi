'use client'

import { Calendar, Clock, ChevronRight, DollarSign, Phone, Star, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import BookingModal from '@/app/psychiatrists/bookingModal'

const getInitials = (name = '') => {
  const parts = name.toString().trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'DR'
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return value
    .toString()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const getFeeValue = (psychiatrist) => {
  const fee = Number(
    psychiatrist.consultationFee ??
      psychiatrist.consultation_fee ??
      psychiatrist.fee ??
      0
  )
  return Number.isFinite(fee) ? fee : 0
}

const formatFee = (fee) => {
  if (!fee) return 'Contact for pricing'
  const normalized = fee % 1 === 0 ? fee.toFixed(0) : fee.toFixed(2)
  return `$${normalized}`
}

const getRatingValue = (psychiatrist) => {
  const rating = Number(psychiatrist.rating ?? 0)
  return Number.isFinite(rating) ? rating : 0
}

const getExperienceValue = (psychiatrist) => {
  const parsed = Number.parseInt(psychiatrist.experience ?? 0, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

const getSessionDuration = (value) => {
  const parsed = Number.parseInt(value ?? 0, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 45
}

const isAvailableNow = (psychiatrist) =>
  Boolean(
    psychiatrist.isOnline ??
      psychiatrist.availableToday ??
      psychiatrist.available_today ??
      false
  )

export default function PsychiatristCard({ psychiatrist }) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingType, setBookingType] = useState('video')

  const specializations = normalizeList(psychiatrist.specialization)
  const displayedSpecializations = specializations.length ? specializations : ['General Psychiatry']
  const visibleSpecializations = displayedSpecializations.slice(0, 3)
  const remainingSpecializations = displayedSpecializations.length - visibleSpecializations.length

  const ratingValue = getRatingValue(psychiatrist)
  const ratingLabel = ratingValue ? ratingValue.toFixed(1) : 'New'
  const ratingClasses = ratingValue
    ? 'bg-amber-50 text-amber-700 border-amber-100'
    : 'bg-neutral-100 text-neutral-600 border-neutral-200'

  const feeValue = getFeeValue(psychiatrist)
  const feeLabel = formatFee(feeValue)

  const experienceValue = getExperienceValue(psychiatrist)
  const experienceLabel = experienceValue ? `${experienceValue} yrs experience` : 'New to MindCare'

  const availability = isAvailableNow(psychiatrist)
  const availabilityLabel = availability ? 'Available today' : 'Schedule ahead'
  const availabilityClasses = availability
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-neutral-100 text-neutral-600 border-neutral-200'

  const safePsychiatrist = {
    ...psychiatrist,
    consultationFee: feeValue,
    minSessionDuration: getSessionDuration(
      psychiatrist.minSessionDuration ?? psychiatrist.min_session_duration
    ),
    nextAvailable: psychiatrist.nextAvailable ?? psychiatrist.next_available ?? 'Next available this week',
    acceptsInsurance: Boolean(
      psychiatrist.acceptsInsurance ?? psychiatrist.accepts_insurance ?? false
    )
  }

  const handleBookNow = useCallback((event) => {
    event.preventDefault()
    try {
      const user = typeof window !== 'undefined' && localStorage.getItem('user')
      if (!user) {
        router.push(`/auth/signin?redirect=/psychiatrists/${psychiatrist.id}`)
        return
      }
      setIsModalOpen(true)
    } catch (error) {
      console.error('Navigation error', error)
      router.push('/auth/signin')
    }
  }, [psychiatrist.id, router])

  const handleViewProfile = useCallback(() => {
    router.push(`/psychiatrists/${psychiatrist.id}`)
  }, [psychiatrist.id, router])

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-3">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-400" aria-hidden />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-center text-lg">
              {getInitials(psychiatrist.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-dark">{psychiatrist.name}</h3>
              <p className="text-sm text-neutral-500">{psychiatrist.title || 'Psychiatrist'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${ratingClasses}`}>
              {ratingValue > 0 && <Star className="w-3.5 h-3.5 fill-current" />}
              {ratingLabel}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${availabilityClasses}`}>
              {availabilityLabel}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600">
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{experienceLabel}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>{feeLabel}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleSpecializations.map((spec) => (
            <span
              key={spec}
              className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
          {remainingSpecializations > 0 && (
            <span className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1 rounded-full">
              +{remainingSpecializations} more
            </span>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-700">Book now</p>
              <p className="text-xs text-neutral-500">{safePsychiatrist.nextAvailable}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              {safePsychiatrist.minSessionDuration} min
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { id: 'video', label: 'Video', icon: Video },
              { id: 'phone', label: 'Phone', icon: Phone }
            ].map((option) => {
              const Icon = option.icon
              const isActive = bookingType === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBookingType(option.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleBookNow}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3"
            >
              <Calendar className="w-4 h-4" />
              Book now
            </button>
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              View profile
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          psychiatrist={safePsychiatrist}
          selectedDate=""
          selectedTime=""
          bookingType={bookingType}
        />
      )}
    </div>
  )
}
