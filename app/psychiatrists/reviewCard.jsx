import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 transition">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{review.patient}</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">• {review.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {review.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <ThumbsUp className="w-5 h-5" />
          <span>Helpful ({review.helpful})</span>
        </button>
        <button className="text-gray-600 hover:text-blue-600 transition">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}