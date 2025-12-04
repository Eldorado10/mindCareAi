import { 
  Star, 
  Clock, 
  DollarSign, 
  Award,
  CheckCircle,
  Calendar,
  MessageSquare,
  Phone,
  Video
} from 'lucide-react'
import Link from 'next/link'

export default function PsychiatristCard({ psychiatrist }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Header with online status */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl">
                {psychiatrist.image}
              </div>
              {psychiatrist.isOnline && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{psychiatrist.name}</h3>
              <p className="text-blue-600 font-medium">{psychiatrist.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-900">{psychiatrist.rating}</span>
                  <span className="text-gray-500">({psychiatrist.reviews} reviews)</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{psychiatrist.experience} experience</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${psychiatrist.consultationFee}</div>
            <div className="text-sm text-gray-500">per session</div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {psychiatrist.specialization.map((spec, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Languages */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Languages</div>
              <div className="font-medium text-gray-900">
                {psychiatrist.languages.join(', ')}
              </div>
            </div>
          </div>

          {/* Next Available */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Next Available</div>
              <div className="font-medium text-gray-900">{psychiatrist.nextAvailable}</div>
            </div>
          </div>

          {/* Session Duration */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Session Duration</div>
              <div className="font-medium text-gray-900">{psychiatrist.minSessionDuration} minutes</div>
            </div>
          </div>

          {/* Insurance */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Insurance</div>
              <div className="font-medium text-gray-900">
                {psychiatrist.acceptsInsurance ? 'Accepts insurance' : 'Self-pay only'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/psychiatrists/${psychiatrist.id}`}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition"
          >
            View Profile
          </Link>
          <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  )
}