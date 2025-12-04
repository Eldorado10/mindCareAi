import { Star } from 'lucide-react'

export default function TestimonialCard({ name, role, content, rating, avatar }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-2xl">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      
      <p className="text-gray-700 italic mb-6">"{content}"</p>
      
      <div className="pt-6 border-t border-gray-100">
        <div className="text-sm text-gray-500">Used MindCare AI for 3 months</div>
      </div>
    </div>
  )
}