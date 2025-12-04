'use client'

import { useEffect, useState } from 'react'

export default function StatsCounter({ icon, end, label, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000 // 2 seconds
    const increment = end / (duration / 16) // 60fps
    
    const timer = setInterval(() => {
      start += increment
      if (start > end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end])

  return (
    <div className="text-center group">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-5xl font-bold text-gray-900 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  )
}