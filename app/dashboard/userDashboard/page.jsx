'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Brain, 
  Calendar, 
  MessageCircle, 
  Heart, 
  TrendingUp,
  Activity,
  BookOpen,
  Users,
  Clock,
  Award,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    totalSessions: 12,
    moodAverage: 4.2,
    streakDays: 7,
    upcomingAppointments: 2
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [recommendedPsychiatrists, setRecommendedPsychiatrists] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    // Load user data
    const activities = [
      { type: 'chat', title: 'AI Therapy Session', time: '2 hours ago', duration: '25 min' },
      { type: 'mood', title: 'Mood Logged', time: 'Yesterday', value: '4/5 😊' },
      { type: 'exercise', title: 'Breathing Exercise', time: '2 days ago', duration: '10 min' },
      { type: 'journal', title: 'Journal Entry', time: '3 days ago', preview: 'Had a good day...' }
    ]
    
    const psychiatrists = [
      { name: 'Dr. Sarah Johnson', specialty: 'Depression & Anxiety', rating: 4.9, nextAvailable: 'Tomorrow' },
      { name: 'Dr. Michael Chen', specialty: 'Stress Management', rating: 4.8, nextAvailable: 'Today' }
    ]
    
    setRecentActivities(activities)
    setRecommendedPsychiatrists(psychiatrists)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
              <p className="text-blue-100">Here's your mental wellness overview</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{userStats.totalSessions}</div>
                <div className="text-gray-600">Total Sessions</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{userStats.moodAverage}/5</div>
                <div className="text-gray-600">Mood Average</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{userStats.streakDays} days</div>
                <div className="text-gray-600">Current Streak</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{userStats.upcomingAppointments}</div>
                <div className="text-gray-600">Upcoming Appointments</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/chat"
                  className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl text-center hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium text-gray-900">AI Chat</div>
                  <div className="text-sm text-gray-600">Talk now</div>
                </Link>

                <Link
                  href="/mood-tracker"
                  className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl text-center hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium text-gray-900">Mood Tracker</div>
                  <div className="text-sm text-gray-600">Log today</div>
                </Link>

                <Link
                  href="/psychiatrists"
                  className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl text-center hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium text-gray-900">Find Psychiatrist</div>
                  <div className="text-sm text-gray-600">Book session</div>
                </Link>

                <Link
                  href="/resources"
                  className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl text-center hover:shadow-md transition"
                >
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-medium text-gray-900">Resources</div>
                  <div className="text-sm text-gray-600">Learn more</div>
                </Link>
              </div>
            </div>

            {/* Recommended Psychiatrists */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended Psychiatrists</h2>
                <Link
                  href="/psychiatrists"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recommendedPsychiatrists.map((psy, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                        👩‍⚕️
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{psy.name}</h3>
                        <p className="text-gray-600 text-sm">{psy.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold">{psy.rating}/5</span>
                        </div>
                        <div className="text-sm text-gray-600">Available {psy.nextAvailable}</div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === 'chat' ? 'bg-blue-100' :
                        activity.type === 'mood' ? 'bg-green-100' :
                        activity.type === 'exercise' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        {activity.type === 'chat' && <MessageCircle className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'mood' && <Heart className="w-5 h-5 text-green-600" />}
                        {activity.type === 'exercise' && <Activity className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'journal' && <BookOpen className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.title}</h3>
                        {activity.duration && (
                          <p className="text-sm text-gray-600">{activity.duration} session</p>
                        )}
                        {activity.value && (
                          <p className="text-sm text-gray-600">Mood: {activity.value}</p>
                        )}
                        {activity.preview && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">"{activity.preview}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {session.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{session.user?.name}</h3>
                  <p className="text-gray-600 text-sm">{session.user?.email}</p>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Edit Profile</span>
                </Link>

                <Link
                  href="/appointments"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">My Appointments</span>
                </Link>

                <Link
                  href="/subscription"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Subscription</span>
                </Link>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-4">Weekly Goal</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>3/5 sessions completed</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-blue-100 text-sm">Keep going! Complete 2 more sessions this week.</p>
            </div>

            {/* Emergency Resources */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Emergency Resources</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition">
                  <div className="font-bold text-lg">988</div>
                  <div className="text-sm">Suicide Prevention Lifeline</div>
                </button>
                <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition">
                  <div className="font-bold text-lg">911</div>
                  <div className="text-sm">Emergency Services</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}