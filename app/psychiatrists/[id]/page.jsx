'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Star, 
  Clock, 
  DollarSign, 
  Award,
  Calendar,
  MessageSquare,
  Phone,
  Video,
  MapPin,
  Shield,
  Heart,
  GraduationCap,
  Users,
  ArrowLeft,
  CheckCircle,
  Globe,
  Briefcase,
  BookOpen,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  User,
  CreditCard
} from 'lucide-react'
import { psychiatrists } from '@/lib/psychiatrists'
import BookingModal from '@/app/psychiatrists/BookingModal.jsx'
import ReviewCard from '@/app/psychiatrists/reviewCard.jsx'

export default function PsychiatristDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [bookingType, setBookingType] = useState('video')
  const [activeTab, setActiveTab] = useState('overview')
  
  const psychiatrist = psychiatrists.find(p => p.id === params.id)

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      patient: 'John D.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Dr. Johnson helped me through a difficult time with depression. Her approach is compassionate and effective.',
      tags: ['Depression', 'Professional', 'Empathetic'],
      helpful: 12
    },
    {
      id: 2,
      patient: 'Maria S.',
      rating: 5,
      date: '1 month ago',
      comment: 'Excellent listener and provides practical strategies for anxiety management. Highly recommend!',
      tags: ['Anxiety', 'Great Listener', 'Practical Advice'],
      helpful: 8
    },
    {
      id: 3,
      patient: 'Robert K.',
      rating: 4,
      date: '2 months ago',
      comment: 'Very professional and knowledgeable. Helped me understand my condition better.',
      tags: ['Knowledgeable', 'Professional'],
      helpful: 5
    },
    {
      id: 4,
      patient: 'Sarah L.',
      rating: 5,
      date: '3 months ago',
      comment: 'Life-changing therapy sessions. The combination of medication management and therapy worked wonders.',
      tags: ['Medication Management', 'Life Changing'],
      helpful: 15
    }
  ]

  // Mock upcoming availability
  const upcomingAvailability = [
    { date: 'Tomorrow', day: 'Mon', times: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'] },
    { date: 'Dec 12', day: 'Tue', times: ['9:00 AM', '11:00 AM', '1:00 PM'] },
    { date: 'Dec 13', day: 'Wed', times: ['10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'] },
    { date: 'Dec 14', day: 'Thu', times: ['9:00 AM', '10:00 AM', '2:00 PM'] }
  ]

  if (!psychiatrist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl mb-6">😔</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Psychiatrist not found</h1>
          <p className="text-gray-600 mb-8">The psychiatrist you're looking for might not be available or has been removed.</p>
          <Link 
            href="/psychiatrists" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Psychiatrists
          </Link>
        </div>
      </div>
    )
  }

  const availability = Object.entries(psychiatrist.availability)
    .filter(([_, times]) => times.length > 0)

  const handleBookAppointment = () => {
    setIsBookingModalOpen(true)
  }

  const handleTimeSelect = (date, time) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setIsBookingModalOpen(true)
  }

  const overallRating = psychiatrist.rating
  const totalReviews = psychiatrist.reviews

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/psychiatrists" className="hover:text-blue-600 transition">Psychiatrists</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{psychiatrist.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Actions */}
            <div className="lg:col-span-2">
              {/* Profile Header Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Image */}
                    <div className="md:w-1/3">
                      <div className="relative">
                        <div className="w-full aspect-square max-w-64 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center text-9xl">
                          {psychiatrist.image}
                        </div>
                        {psychiatrist.isOnline && (
                          <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="md:w-2/3">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                          <h1 className="text-4xl font-bold text-gray-900 mb-2">{psychiatrist.name}</h1>
                          <p className="text-blue-600 text-xl font-medium mb-4">{psychiatrist.title}</p>
                          
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                              <span className="font-bold text-gray-900">{psychiatrist.rating}</span>
                              <span className="text-gray-600">({psychiatrist.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                              <Award className="w-5 h-5 text-green-600" />
                              <span className="text-gray-700">{psychiatrist.experience} experience</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-4xl font-bold text-gray-900">${psychiatrist.consultationFee}</div>
                          <div className="text-gray-600">per {psychiatrist.minSessionDuration} min session</div>
                          {psychiatrist.acceptsInsurance && (
                            <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              <Shield className="w-4 h-4" />
                              Accepts Insurance
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                          {psychiatrist.specialization.map((spec, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={handleBookAppointment}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-3"
                        >
                          <Calendar className="w-6 h-6" />
                          Book Appointment
                        </button>
                        <button className="border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition flex items-center justify-center gap-3">
                          <MessageSquare className="w-6 h-6" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-white rounded-2xl shadow border border-gray-200 mb-8">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-4 px-6 font-medium text-center transition ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('experience')}
                    className={`flex-1 py-4 px-6 font-medium text-center transition ${activeTab === 'experience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => setActiveTab('availability')}
                    className={`flex-1 py-4 px-6 font-medium text-center transition ${activeTab === 'availability' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Availability
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 py-4 px-6 font-medium text-center transition ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Bio */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">About {psychiatrist.name.split(' ')[0]}</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{psychiatrist.bio}</p>
                    </div>

                    {/* Approach */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Therapeutic Approach</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{psychiatrist.approach}</p>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Languages</h3>
                      <div className="flex flex-wrap gap-3">
                        {psychiatrist.languages.map((lang, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl">
                            <Globe className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">{lang}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Session Details */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Details</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">Session Duration</div>
                            <div className="text-gray-700">{psychiatrist.minSessionDuration} minutes</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Video className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">Session Type</div>
                            <div className="text-gray-700">Video, Phone, In-person</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-8">
                    {/* Education */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <GraduationCap className="w-8 h-8 text-blue-600" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {psychiatrist.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-800">{edu}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                        Professional Experience
                      </h3>
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                          <div className="text-lg font-bold text-gray-900 mb-2">{psychiatrist.experience} of Experience</div>
                          <p className="text-gray-700">
                            {psychiatrist.name} has been practicing psychiatry for {psychiatrist.experience}, 
                            specializing in {psychiatrist.specialization.slice(0, 2).join(' and ')}.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Approach Details */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Treatment Approach</h3>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 mb-4">
                          {psychiatrist.name} uses a combination of evidence-based therapies tailored to each patient's needs. 
                          The approach is collaborative, focusing on both symptom relief and long-term wellness.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium">Evidence-Based Methods</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Personalized Treatment Plans</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">Medication Management</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-orange-600" />
                            <span className="font-medium">Therapy Integration</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900">Upcoming Availability</h3>
                    
                    {/* Calendar View */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {upcomingAvailability.map((day, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="text-center mb-4">
                            <div className="text-sm text-gray-600">{day.day}</div>
                            <div className="text-xl font-bold text-gray-900">{day.date}</div>
                          </div>
                          
                          <div className="space-y-2">
                            {day.times.map((time, timeIndex) => (
                              <button
                                key={timeIndex}
                                onClick={() => handleTimeSelect(day.date, time)}
                                className="w-full bg-white border-2 border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-sm font-medium"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Regular Schedule */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Regular Schedule</h4>
                      <div className="space-y-3">
                        {availability.map(([day, times]) => (
                          <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="font-medium text-gray-900 capitalize">{day}</div>
                            <div className="flex flex-wrap gap-2">
                              {times.map((time, index) => (
                                <span key={index} className="px-3 py-1 bg-white rounded-lg text-gray-700 text-sm">
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Booking Information</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Sessions are {psychiatrist.minSessionDuration} minutes long</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>24-hour cancellation policy applies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>First-time patients should arrive 10 minutes early</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Overall Rating */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                      <div>
                        <div className="text-5xl font-bold text-gray-900 mb-2">{overallRating}</div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-6 h-6 ${i < Math.floor(overallRating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <div className="text-gray-600">{totalReviews} verified reviews</div>
                      </div>
                      
                      <div className="space-y-2 min-w-48">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-4">{star}</span>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500"
                                style={{ width: `${(star / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Filters */}
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium">
                        All Reviews
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                        5 Star
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                        4 Star
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                        With Comments
                      </button>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>

                    {/* Write Review Button */}
                    <div className="text-center pt-6 border-t border-gray-200">
                      <button className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
                        <MessageCircle className="w-6 h-6" />
                        Write a Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking & Info */}
            <div className="space-y-8">
              {/* Quick Booking Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Book Appointment</h3>
                
                {/* Session Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Session Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBookingType('video')}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${bookingType === 'video' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <Video className="w-6 h-6 text-blue-600" />
                      <span className="font-medium">Video Call</span>
                      <span className="text-sm text-gray-600">Most popular</span>
                    </button>
                    <button
                      onClick={() => setBookingType('phone')}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${bookingType === 'phone' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <Phone className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Phone Call</span>
                    </button>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">${psychiatrist.consultationFee}</div>
                      <div className="text-gray-600">{psychiatrist.minSessionDuration}-minute session</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Next available</div>
                      <div className="font-bold text-gray-900">{psychiatrist.nextAvailable}</div>
                    </div>
                  </div>
                </div>

                {/* Selected Time (if any) */}
                {selectedDate && selectedTime && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{selectedDate}</div>
                        <div className="text-gray-700">{selectedTime}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDate(null)
                          setSelectedTime(null)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate && !selectedTime}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition ${selectedDate && selectedTime ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {selectedDate && selectedTime ? 'Confirm Booking' : 'Select a Time First'}
                </button>

                {/* Insurance Info */}
                {psychiatrist.acceptsInsurance && (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-gray-900">Insurance Accepted</span>
                    </div>
                    <p className="text-sm text-gray-700">Check with your provider for coverage details</p>
                  </div>
                )}
              </div>

              {/* Contact & Info Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact & Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">(555) 123-4567</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">contact@example.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium text-gray-900">Online & In-person</div>
                    </div>
                  </div>
                </div>

                {/* Share & Save */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition">
                      <Bookmark className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Badges */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Verifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">License Verified</div>
                      <div className="text-sm text-gray-600">Active medical license</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Background Check</div>
                      <div className="text-sm text-gray-600">Completed and cleared</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Patient Reviews</div>
                      <div className="text-sm text-gray-600">{psychiatrist.reviews}+ verified reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        psychiatrist={psychiatrist}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        bookingType={bookingType}
      />
    </>
  )
}