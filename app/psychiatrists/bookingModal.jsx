'use client'

import { useState } from 'react'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function BookingModal({
  isOpen,
  onClose,
  psychiatrist,
  selectedDate,
  selectedTime,
  bookingType
}) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    insuranceProvider: '',
    insuranceId: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Handle booking submission
      alert('Booking confirmed! You will receive a confirmation email shortly.')
      onClose()
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const totalAmount = psychiatrist.consultationFee
  const bookingFee = 0 // Could add booking fee if needed
  const tax = 0 // Could add tax if needed
  const total = totalAmount + bookingFee + tax

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
            <p className="text-gray-600">Complete your booking in {3 - step} steps</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                </div>
                <div className={`ml-2 font-medium ${step >= stepNumber ? 'text-blue-600' : 'text-gray-600'}`}>
                  {stepNumber === 1 && 'Details'}
                  {stepNumber === 2 && 'Payment'}
                  {stepNumber === 3 && 'Confirm'}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-4 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">
                      {selectedDate || psychiatrist.nextAvailable} at {selectedTime || '10:00 AM'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {bookingType === 'video' ? 'Video Consultation' : 'Phone Consultation'} • {psychiatrist.minSessionDuration} minutes
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Briefly describe what you'd like to discuss..."
                />
              </div>

              {psychiatrist.acceptsInsurance && (
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-gray-900">Insurance Information</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        name="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Blue Cross Blue Shield"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member ID
                      </label>
                      <input
                        type="text"
                        name="insuranceId"
                        value={formData.insuranceId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your insurance member ID"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-4">Payment Details</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-medium">${psychiatrist.consultationFee}</span>
                  </div>
                  {bookingFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Fee</span>
                      <span className="font-medium">${bookingFee}</span>
                    </div>
                  )}
                  {tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">Credit/Debit Card</span>
                    <div className="flex gap-2">
                      <span className="text-xl">💳</span>
                      <span className="text-xl">💳</span>
                      <span className="text-xl">💳</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">Secure Payment</div>
                  <p className="text-sm text-gray-700">
                    Your payment is encrypted and secure. We use bank-level security to protect your information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Ready to Book!</h4>
                <p className="text-gray-600">Review your appointment details below</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Psychiatrist</span>
                    <span className="font-medium">{psychiatrist.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium">
                      {selectedDate || psychiatrist.nextAvailable} at {selectedTime || '10:00 AM'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{psychiatrist.minSessionDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium capitalize">{bookingType} Consultation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patient</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">Cancellation Policy</div>
                  <p className="text-sm text-gray-700">
                    You can cancel or reschedule up to 24 hours before your appointment without any charge.
                    Late cancellations may incur a fee.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-bold text-gray-900">What happens next?</div>
                  <p className="text-sm text-gray-700">
                    You'll receive a confirmation email with the meeting link and instructions.
                    The psychiatrist will join at the scheduled time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition"
            >
              {step === 3 ? 'Confirm Booking' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}