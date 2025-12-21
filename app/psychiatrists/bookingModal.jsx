'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, Clock, Phone, ShieldCheck, Star, Video, X } from 'lucide-react'
import BookingForm from '@/app/components/BookingForm'

const getInitials = (name = '') => {
  const parts = name.toString().trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'DR'
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

const formatFee = (fee) => {
  const parsed = Number(fee ?? 0)
  if (!Number.isFinite(parsed) || parsed <= 0) return 'Contact for pricing'
  const normalized = parsed % 1 === 0 ? parsed.toFixed(0) : parsed.toFixed(2)
  return `$${normalized}`
}

const parseDateInput = (value) => {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatSelectedDate = (value) => {
  if (!value) return 'Select in form'
  const parsed = parseDateInput(value)
  if (!parsed) return value
  return parsed.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatSelectedTime = (value) => (value ? value : 'Select in form')

const formatSpecialization = (value) => {
  if (!value) return 'Psychiatry'
  if (Array.isArray(value)) {
    const items = value.filter(Boolean)
    if (!items.length) return 'Psychiatry'
    if (items.length <= 2) return items.join(', ')
    return `${items.slice(0, 2).join(', ')} +${items.length - 2} more`
  }
  return value.toString()
}

export default function BookingModal({
  isOpen,
  onClose,
  psychiatrist,
  selectedDate = '',
  selectedTime = '',
  bookingType = 'video'
}) {
  const [mounted, setMounted] = useState(false)
  const [selectedBookingDate, setSelectedBookingDate] = useState(selectedDate || '')
  const [selectedBookingTime, setSelectedBookingTime] = useState(
    selectedTime || '10:00 AM'
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setSelectedBookingDate(selectedDate || '')
    setSelectedBookingTime(selectedTime || '10:00 AM')
  }, [isOpen, selectedDate, selectedTime])

  if (!isOpen || !mounted) return null

  const psychiatristName = psychiatrist?.name || 'Selected psychiatrist'
  const psychiatristId =
    psychiatrist?.id ?? psychiatrist?._id ?? psychiatrist?.psychiatristId ?? ''
  const specializationLabel = formatSpecialization(psychiatrist?.specialization)
  const feeLabel = formatFee(
    psychiatrist?.consultationFee ??
      psychiatrist?.consultation_fee ??
      psychiatrist?.fee ??
      0
  )
  const sessionDuration =
    psychiatrist?.minSessionDuration ?? psychiatrist?.min_session_duration ?? 45
  const sessionDurationLabel = Number.isFinite(Number(sessionDuration))
    ? `${Number(sessionDuration)} min`
    : 'Session length varies'
  const nextAvailable =
    psychiatrist?.nextAvailable ?? psychiatrist?.next_available ?? 'Next available this week'
  const sessionTypeLabel = bookingType === 'phone' ? 'Phone' : 'Video'
  const SessionIcon = bookingType === 'phone' ? Phone : Video

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white/95 border border-white/60 shadow-soft-3">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative p-8 bg-gradient-to-br from-primary/10 via-white to-secondary/10">
            <div className="absolute -top-16 -right-20 h-40 w-40 rounded-full bg-white/40 blur-2xl" aria-hidden />
            <div className="absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-white/30 blur-3xl" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-semibold flex items-center justify-center text-lg">
                  {getInitials(psychiatristName)}
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Booking with</p>
                  <h3 className="text-2xl font-bold text-neutral-dark">{psychiatristName}</h3>
                  <p className="text-sm text-neutral-500">{specializationLabel}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <SessionIcon className="w-4 h-4 text-primary" />
                    Session type
                  </span>
                  <span className="font-semibold text-neutral-dark">{sessionTypeLabel}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4 text-primary" />
                    Preferred date
                  </span>
                  <span className="font-semibold text-neutral-dark">
                    {formatSelectedDate(selectedBookingDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Clock className="w-4 h-4 text-primary" />
                    Preferred time
                  </span>
                  <span className="font-semibold text-neutral-dark">
                    {formatSelectedTime(selectedBookingTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Clock className="w-4 h-4 text-primary" />
                    Session length
                  </span>
                  <span className="font-semibold text-neutral-dark">{sessionDurationLabel}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4 text-primary" />
                    Next available
                  </span>
                  <span className="font-semibold text-neutral-dark">{nextAvailable}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Star className="w-4 h-4 text-amber-500" />
                    Session fee
                  </span>
                  <span className="font-semibold text-neutral-dark">{feeLabel}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  HIPAA-ready
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Easy rescheduling
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Confirmation within 24h
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-3 py-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Trusted network
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">Confirm your appointment</h2>
                <p className="text-sm text-neutral-500">
                  Share a few details to reserve your time with this psychiatrist.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-neutral-200 p-2 text-neutral-500 transition hover:text-neutral-700 hover:border-neutral-300"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6">
              <BookingForm
                psychiatristId={psychiatristId}
                psychiatristName={psychiatristName}
                bookingType={bookingType}
                initialDate={selectedBookingDate}
                initialTimeSlot={selectedBookingTime}
                onDateChange={setSelectedBookingDate}
                onTimeChange={setSelectedBookingTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
