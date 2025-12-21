import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Brain, 
  MessageCircle, 
  Users, 
  Shield, 
  Star,
  ChevronRight,
  CheckCircle,
  Award,
  UserCheck,
  Clock4,
  TrendingUp,
  ShieldCheck,
  HeartHandshake,
  BrainCircuit,
  Sparkles,
  Leaf,
  Waves,
  Sun,
  Moon,
  Sparkle
} from 'lucide-react'
import ChatBot from '../ChatBot'

export default function HeroSection() {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if user is logged in
  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Support",
      description: "24/7 intelligent chatbot with personalized mental health guidance",
      color: 'var(--color-primary-500)',
      gradient: 'linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500))'
    },
    {
      icon: UserCheck,
      title: "Expert Psychiatrists",
      description: "Connect with licensed professionals for personalized care",
      color: 'var(--color-secondary-500)',
      gradient: 'linear-gradient(135deg, var(--color-secondary-500), var(--color-accent-sky))'
    },
    {
      icon: HeartHandshake,
      title: "Community Support",
      description: "Join a supportive community and share experiences",
      color: 'var(--color-accent-mint)',
      gradient: 'linear-gradient(135deg, var(--color-accent-mint), var(--color-success))'
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      description: "End-to-end encryption and strict privacy protocols",
      color: 'var(--color-info)',
      gradient: 'linear-gradient(135deg, var(--color-info), var(--color-primary-600))'
    }
  ]

  const stats = [
    { label: "Happy Users", value: "10K+", icon: Users, color: 'var(--color-primary-500)' },
    { label: "Sessions", value: "50K+", icon: MessageCircle, color: 'var(--color-secondary-500)' },
    { label: "Success Rate", value: "95%", icon: TrendingUp, color: 'var(--color-success)' },
    { label: "Response Time", value: "<2min", icon: Clock4, color: 'var(--color-warning)' }
  ]

  const handleStartChat = () => {
    if (user) {
      setIsChatOpen(true)
    } else {
      router.push('/auth/signin')
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary-500/20 rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary-500/20 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-accent-mint/20 rounded-full animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/3 right-10 w-4 h-4 bg-accent-sky/20 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-accent-mint/5 via-transparent to-accent-sky/5"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8" data-reveal>
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-3 rounded-full px-6 py-3 shadow-lg" style={{ 
              background: 'linear-gradient(135deg, rgba(138, 71, 255, 0.1), rgba(0, 255, 197, 0.1))',
              border: '1px solid rgba(138, 71, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--color-success)' }}></div>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                AI Support + Professional Care
              </span>
              <Sparkle className="w-4 h-4" style={{ color: 'var(--color-primary-500)' }} />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-hero font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Your Mental Health
              <span className="block gradient-text" style={{ 
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Journey Starts Here
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-body-large max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
              Get immediate AI-powered support and connect with licensed psychiatrists. 
              Your path to better mental wellness begins with personalized, accessible care.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleStartChat}
                className="group relative overflow-hidden bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/30"
                style={{ 
                  boxShadow: '0 10px 30px rgba(138, 71, 255, 0.4)',
                  transform: `translateY(${scrollY * 0.1}px)`
                }}
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chat</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
              </button>
              
              <Link
                href="/psychiatrists"
                className="group relative overflow-hidden border-2 border-primary-500/30 bg-transparent hover:bg-primary-500/10 text-primary-600 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                style={{ 
                  boxShadow: '0 4px 15px rgba(138, 71, 255, 0.2)',
                  transform: `translateY(${scrollY * 0.05}px)`
                }}
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <UserCheck className="w-5 h-5" />
                  <span>Find Experts</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors"></div>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6" style={{ color: 'var(--color-text-secondary)' }}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                <span className="text-sm">24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" style={{ color: 'var(--color-primary-500)' }} />
                <span className="text-sm">100% Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" style={{ color: 'var(--color-secondary-500)' }} />
                <span className="text-sm">Certified Experts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" style={{ color: 'var(--color-accent-mint)' }} />
                <span className="text-sm">Natural Approach</span>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Chatbot Preview */}
          <div className="relative" data-reveal>
            {/* Floating Card Effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative rounded-3xl p-0 shadow-2xl overflow-hidden" style={{ 
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              transform: `translateY(${scrollY * 0.05}px)`,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
            }}>
              {/* Enhanced Chatbot Preview */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>MindCare AI</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Online • Ready to help</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Light mode">
                      <Sun className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Dark mode">
                      <Moon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                  </div>
                </div>

                {/* Sample Conversation Preview */}
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 rounded-2xl p-3" style={{ background: 'var(--color-muted)' }}>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Hi there! I'm feeling a bit anxious today.</p>
                  </div>
                  <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-3">
                    <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>I'm here to listen. Take a deep breath with me - inhale for 4 counts, hold for 4, exhale for 6. How does that feel?</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3" style={{ background: 'var(--color-muted)' }}>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Better already, thank you!</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-primary-500/10 transition-colors" style={{ 
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border)'
                  }}>
                    🧘‍♀️ Breathing Exercise
                  </button>
                  <button className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-secondary-500/10 transition-colors" style={{ 
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border)'
                  }}>
                    📝 Mood Tracker
                  </button>
                  <button className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-accent-mint/10 transition-colors" style={{ 
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border)'
                  }}>
                    🤝 Find Support
                  </button>
                  <button className="text-xs px-3 py-2 rounded-lg border border-gray-200 hover:bg-accent-sky/10 transition-colors" style={{ 
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border)'
                  }}>
                    📞 Emergency Help
                  </button>
                </div>

                {/* CTA to Full Chat */}
                <button 
                  onClick={handleStartChat}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Start Your Journey →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20" style={{ 
          background: 'linear-gradient(135deg, rgba(138, 71, 255, 0.05), rgba(0, 255, 197, 0.05))',
          border: '1px solid rgba(138, 71, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-8 rounded-2xl">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group" data-reveal>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ 
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                  border: `1px solid ${stat.color}30`
                }}>
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16" data-reveal>
            <h2 className="text-heading mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Comprehensive Mental Health Support
            </h2>
            <p className="text-body-large" style={{ color: 'var(--color-text-secondary)' }}>
              Everything you need for your mental wellness journey in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center" data-reveal>
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ 
                  background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                  border: `1px solid ${feature.color}30`,
                  boxShadow: `0 10px 30px ${feature.color}20`
                }}>
                  <feature.icon className="w-10 h-10" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold mb-3 text-lg" style={{ color: 'var(--color-text-primary)' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="absolute bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
        <button 
          onClick={handleStartChat}
          className="group relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/30"
          style={{ boxShadow: '0 10px 30px rgba(138, 71, 255, 0.4)' }}
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
        </button>
      </div>

      {/* Chat Bot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}></div>
          <div className="absolute bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-2xl h-[70vh] max-h-[90vh] -translate-x-1/2" data-reveal>
            <ChatBot fullMode />
          </div>
        </div>
      )}
    </section>
  )
}
