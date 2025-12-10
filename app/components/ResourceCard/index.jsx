export default function ResourceCard({ icon, title, description, category, color = 'blue', features = [] }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    green: 'border-green-200 bg-green-50 hover:bg-green-100',
    pink: 'border-pink-200 bg-pink-50 hover:bg-pink-100',
    orange: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
    yellow: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
  }

  const textColors = {
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    green: 'text-green-700',
    pink: 'text-pink-700',
    orange: 'text-orange-700',
    yellow: 'text-yellow-700'
  }

  const selectedColorClass = colorClasses[color] || colorClasses.blue
  const selectedTextColor = textColors[color] || textColors.blue

  // Ensure features is an array
  const featuresList = Array.isArray(features) ? features : []

  return (
    <div className={`rounded-2xl border-2 ${selectedColorClass} p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-4xl mb-4 block">{icon}</span>
          <span className={`inline-block px-4 py-1.5 rounded-full ${selectedTextColor} font-semibold text-sm border border-current`}>
            {category}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-3 mb-8">
        {featuresList.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${selectedTextColor}`}></div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <button className={`w-full py-3 rounded-xl font-semibold ${selectedTextColor} border-2 border-current hover:bg-white transition`}>
        Explore Resource
      </button>
    </div>
  )
}