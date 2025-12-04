'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, BarChart3, Target } from 'lucide-react'

const moods = [
  { emoji: '😭', label: 'Very Low', value: 1, color: 'bg-red-500' },
  { emoji: '😔', label: 'Low', value: 2, color: 'bg-orange-400' },
  { emoji: '😐', label: 'Neutral', value: 3, color: 'bg-yellow-400' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-green-400' },
  { emoji: '😊', label: 'Very Good', value: 5, color: 'bg-green-500' }
]

const activities = [
  { icon: '🏃', label: 'Exercise' },
  { icon: '📖', label: 'Reading' },
  { icon: '🎨', label: 'Creative' },
  { icon: '🧘', label: 'Meditation' },
  { icon: '👥', label: 'Social' },
  { icon: '😴', label: 'Rest' }
]

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedActivities, setSelectedActivities] = useState([])
  const [notes, setNotes] = useState('')
  const [moodHistory, setMoodHistory] = useState([])

  // Generate sample data
  useEffect(() => {
    const sampleData = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      sampleData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: Math.floor(Math.random() * 5) + 1,
        day: date.getDate()
      })
    }
    setMoodHistory(sampleData.reverse())
  }, [])

  const logMood = () => {
    if (!selectedMood) return
    
    const newEntry = {
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      mood: selectedMood,
      activities: selectedActivities,
      notes: notes
    }
    
    alert(`Mood logged successfully! ${selectedMood}/5 - ${moods.find(m => m.value === selectedMood)?.label}`)
    
    // Reset form
    setSelectedMood(null)
    setSelectedActivities([])
    setNotes('')
  }

  const toggleActivity = (activity) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const getMoodColor = (value) => {
    return moods.find(m => m.value === value)?.color || 'bg-gray-300'
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Mood Selection */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">How are you feeling right now?</h3>
                <p className="text-gray-600">Select your current mood</p>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="mb-8">
              <div className="flex justify-between mb-6">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                      selectedMood === mood.value
                        ? `${mood.color} text-white scale-110 shadow-lg`
                        : 'hover:bg-gray-50 hover:scale-105'
                    }`}
                  >
                    <span className="text-4xl mb-2">{mood.emoji}</span>
                    <span className="font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">What activities influenced your mood?</h4>
              <div className="grid grid-cols-3 gap-3">
                {activities.map((activity) => (
                  <button
                    key={activity.label}
                    onClick={() => toggleActivity(activity.label)}
                    className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                      selectedActivities.includes(activity.label)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-2xl mb-2">{activity.icon}</span>
                    <span className="text-sm font-medium">{activity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Add notes (optional)</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind? You can write about your day, thoughts, or anything else..."
                className="w-full h-32 border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={logMood}
              disabled={!selectedMood}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log My Mood
            </button>
          </div>

          {/* Right Column - Analytics */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Your Mood Analytics</h3>
                <p className="text-gray-600">Weekly overview & insights</p>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-gray-800">This Week's Mood</h4>
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              
              <div className="space-y-4">
                {moodHistory.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 text-sm font-medium text-gray-600">{day.date}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getMoodColor(day.mood)}`}
                            style={{ width: `${(day.mood / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-right font-bold text-gray-700">
                          {day.mood}<span className="text-gray-400">/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-gray-900">Weekly Insights</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Average Mood</span>
                  <span className="font-bold text-gray-900">3.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Best Day</span>
                  <span className="font-bold text-gray-900">Thursday (4.5/5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Consistency</span>
                  <span className="font-bold text-green-600">↑ 15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Mood Swings</span>
                  <span className="font-bold text-gray-900">Low</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-blue-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-700">Tip:</span> Your mood tends to improve after social activities. Consider scheduling more social time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}