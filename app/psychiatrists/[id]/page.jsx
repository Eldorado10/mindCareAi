'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Briefcase, Calendar, ChevronLeft, Clock, DollarSign, MapPin, Phone, Star, Video } from 'lucide-react'
import BookingModal from '@/app/psychiatrists/bookingModal'

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return value
    .toString()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const getInitials = (name = '') => {
  const parts = name.toString().trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'DR'
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

const getRatingValue = (psychiatrist) => {
  const rating = Number(psychiatrist.rating ?? 0)
  return Number.isFinite(rating) ? rating : 0
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

const getExperienceLabel = (value) => {
  if (value === null || value === undefined) return 'Experience available on request'
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) return `${parsed}+ years experience`
    return value
  }
  if (Number.isFinite(value) && value > 0) return `${value}+ years experience`
  return 'New to MindCare'
}

const formatSpecializationLabel = (items) => {
  if (!items.length) return 'Psychiatry'
  if (items.length <= 2) return items.join(', ')
  return `${items.slice(0, 2).join(', ')} +${items.length - 2} more`
}

const formatDayLabel = (day) => {
  if (!day) return ''
  const normalized = day.toString().trim()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const parseAvailability = (value) => {
  if (!value) return { type: 'none' }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return { type: 'none' }
    const isJson = trimmed.startsWith('{') || trimmed.startsWith('[')
    if (isJson) {
      try {
        const parsed = JSON.parse(trimmed)
        return parseAvailability(parsed)
      } catch (error) {
        return { type: 'text', text: trimmed }
      }
    }
    return { type: 'text', text: trimmed }
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => item?.toString().trim()).filter(Boolean)
    if (!items.length) return { type: 'none' }
    return { type: 'text', text: items.join(', ') }
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([day, times]) => ({
        day: formatDayLabel(day),
        times: normalizeList(times)
      }))
      .filter((entry) => entry.times.length > 0)

    if (entries.length) {
      return { type: 'list', entries }
    }
  }

  return { type: 'none' }
}

export default function PsychiatristDetail() {
  const params = useParams()
  const router = useRouter()
  const [psychiatrist, setPsychiatrist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingType, setBookingType] = useState('video')

  useEffect(() => {
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
  }, [params.id])

  const specializationList = useMemo(
    () => normalizeList(psychiatrist?.specialization),
    [psychiatrist]
  )

  const languages = useMemo(
    () => normalizeList(psychiatrist?.languages),
    [psychiatrist]
  )

  const ratingValue = psychiatrist ? getRatingValue(psychiatrist) : 0
  const ratingLabel = ratingValue ? ratingValue.toFixed(1) : 'New'
  const feeValue = psychiatrist ? getFeeValue(psychiatrist) : 0
  const feeLabel = formatFee(feeValue)
  const experienceLabel = getExperienceLabel(psychiatrist?.experience)
  const specializationLabel = formatSpecializationLabel(specializationList)

  const availabilityInfo = useMemo(
    () => parseAvailability(psychiatrist?.availability),
    [psychiatrist]
  )

  const availabilitySummary = useMemo(() => {
    if (availabilityInfo.type === 'list' && availabilityInfo.entries.length > 0) {
      const firstEntry = availabilityInfo.entries[0]
      const firstTime = firstEntry.times[0] || 'Available times'
      return `${firstEntry.day} ${firstTime}`.trim()
    }
    if (availabilityInfo.type === 'text') return availabilityInfo.text
    return 'Schedule available on request'
  }, [availabilityInfo])

  const sessionDuration = Number.parseInt(
    psychiatrist?.minSessionDuration ?? psychiatrist?.min_session_duration ?? 45,
    10
  )
  const sessionDurationLabel = Number.isFinite(sessionDuration) ? `${sessionDuration} min session` : 'Session length varies'
  const safePsychiatrist = psychiatrist
    ? {
        ...psychiatrist,
        consultationFee: feeValue,
        minSessionDuration: Number.isFinite(sessionDuration) ? sessionDuration : 45,
        nextAvailable: availabilitySummary,
        acceptsInsurance: Boolean(
          psychiatrist.acceptsInsurance ?? psychiatrist.accepts_insurance ?? false
        )
      }
    : null

  const handleOpenBooking = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if (!user) {
        router.push(`/auth/signin?redirect=/psychiatrists/${params.id}`)
        return
      }
    }
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
        <div className="soft-card p-8 rounded-2xl bg-white/95 border border-white/60 text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading psychiatrist profile...</p>
        </div>
      </div>
    )
  }

  if (error || !psychiatrist) {
    return (
      <div className="min-h-screen bg-neutral-light px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/psychiatrists"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Psychiatrists
          </Link>
          <div className="soft-card mt-10 p-10 rounded-3xl bg-white/95 border border-white/60 text-center">
            <h2 className="text-2xl font-bold text-neutral-dark mb-3">Unable to load profile</h2>
            <p className="text-neutral-500">{error || 'Psychiatrist not found.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-80" aria-hidden />
        <div className="absolute -top-20 -right-32 w-72 h-72 bg-white/20 blur-3xl rounded-full" aria-hidden />
        <div className="absolute -bottom-24 left-10 w-64 h-64 bg-white/10 blur-3xl rounded-full" aria-hidden />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <Link
            href="/psychiatrists"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Psychiatrists
          </Link>

          <div className="mt-8 grid lg:grid-cols-[1.4fr_0.6fr] gap-8 items-start">
            <div className="text-white">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="h-20 w-20 rounded-3xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-bold">
                  {getInitials(psychiatrist.name)}
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold">{psychiatrist.name}</h1>
                  <p className="text-lg text-white/80 mt-2">{specializationLabel}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 px-3 py-1 text-sm font-semibold">
                      <Star className="w-4 h-4 text-yellow-300" />
                      {ratingLabel} rating
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 px-3 py-1 text-sm font-semibold">
                      <Briefcase className="w-4 h-4" />
                      {experienceLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 px-3 py-1 text-sm font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {feeLabel} per session
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 text-white">
              <p className="text-sm text-white/70">Session snapshot</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>{feeLabel} per session</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>{sessionDurationLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>{availabilitySummary}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  document.getElementById('booking')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  })
                }
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 font-semibold text-slate-900 shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3"
              >
                Book this session
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="soft-card p-6 rounded-2xl bg-white/95 border border-white/60">
              <h2 className="text-xl font-bold text-neutral-dark mb-3">About</h2>
              <p className="text-neutral-600 leading-relaxed">
                {psychiatrist.bio || 'This psychiatrist has not added a bio yet. Please check back soon for more details.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="soft-card p-6 rounded-2xl bg-white/95 border border-white/60">
                <h3 className="text-lg font-bold text-neutral-dark mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {(specializationList.length ? specializationList : ['General Psychiatry']).map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="soft-card p-6 rounded-2xl bg-white/95 border border-white/60">
                <h3 className="text-lg font-bold text-neutral-dark mb-4">Availability</h3>
                {availabilityInfo.type === 'list' ? (
                  <div className="space-y-3 text-sm text-neutral-600">
                    {availabilityInfo.entries.map((entry) => (
                      <div key={entry.day} className="flex items-start justify-between gap-4">
                        <span className="font-semibold text-neutral-dark">{entry.day}</span>
                        <span className="text-right">{entry.times.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">
                    {availabilitySummary}
                  </p>
                )}
              </div>
            </div>

            {languages.length > 0 && (
              <div className="soft-card p-6 rounded-2xl bg-white/95 border border-white/60">
                <h3 className="text-lg font-bold text-neutral-dark mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <span
                      key={language}
                      className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div id="booking" className="lg:sticky lg:top-24 space-y-4">
              <div className="soft-card p-6 rounded-2xl bg-white/95 border border-white/60">
                <h3 className="text-lg font-bold text-neutral-dark">Book a session</h3>
                <p className="text-sm text-neutral-500 mt-2">
                  Choose a session type and confirm your preferred time in the booking modal.
                </p>

                <div className="mt-4 space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      Session fee
                    </span>
                    <span className="font-semibold text-neutral-dark">{feeLabel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Session length
                    </span>
                    <span className="font-semibold text-neutral-dark">{sessionDurationLabel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Next available
                    </span>
                    <span className="font-semibold text-neutral-dark">{availabilitySummary}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
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

                <button
                  type="button"
                  onClick={handleOpenBooking}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3"
                >
                  <Calendar className="w-4 h-4" />
                  Open booking modal
                </button>

                <p className="text-xs text-neutral-500 mt-4">
                  You can confirm the date, time, and payment details in the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {safePsychiatrist && (
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
