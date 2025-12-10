'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Brain, 
  MessageCircle, 
  Heart, 
  Users, 
  Shield, 
  Star,
  ChevronRight,
  CheckCircle,
  Clock,
  Smartphone,
  TrendingUp,
  BookOpen,
  Headphones,
  Zap,
  UserCheck,
  Calendar,
  Award,
  Sparkles,
  ShieldCheck,
  Clock4,
  HeartHandshake,
  BrainCircuit
} from 'lucide-react'
import ChatBot from "@/app/components/ChatBot"
import MoodTracker from '@/app/components/MoodTracker'
import TestimonialCard from '@/app/components/TestimonialCard'
import ResourceCard from '@/app/components/ResourceCard'
import FeatureCard from  '@/app/components/FeatureCard'
import StatsCounter from '@/app/components/StatsCounter'
import { fetchPsychiatrists } from '@/lib/api-client'

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [featuredPsychiatrists, setFeaturedPsychiatrists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedPsychiatrists() {
      try {
        const data = await fetchPsychiatrists()
        const topPsychiatrists = data
          ?.sort((a, b) => b.rating - a.rating)
          ?.slice(0, 3) || []
        setFeaturedPsychiatrists(topPsychiatrists)
      } catch (error) {
        console.error('Error loading psychiatrists:', error)
        setFeaturedPsychiatrists([])
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedPsychiatrists()
  }, [])

  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Support",
      description: "24/7 intelligent chatbot with personalized mental health guidance",
      color: "blue"
    },
    {
      icon: UserCheck,
      title: "Expert Psychiatrists",
      description: "Connect with licensed professionals for personalized care",
      color: "purple"
    },
    {
      icon: HeartHandshake,
      title: "Community Support",
      description: "Join a supportive community and share experiences",
      color: "pink"
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      description: "End-to-end encryption and strict privacy protocols",
      color: "green"
    }
  ]

  const stats = [
    { label: "Happy Users", value: "10K+", icon: Users },
    { label: "Sessions", value: "50K+", icon: MessageCircle },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Response Time", value: "<2min", icon: Clock4 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MindCare</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/psychiatrists" className="text-gray-700 hover:text-blue-600 transition-colors">
                Psychiatrists
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">
                Resources
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Help</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200 shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  AI Support + Professional Care
                </span>
              </div>
              
              <h1 className="text-hero text-gray-900">
                Your Mental Health
                <span className="block gradient-text">Journey Starts Here</span>
              </h1>
              
              <p className="text-body-large text-gray-600 max-w-2xl">
                Get immediate AI-powered support and connect with licensed psychiatrists. 
                Your path to better mental wellness begins with personalized, accessible care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="btn-primary group flex items-center justify-center space-x-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chat</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <Link
                  href="/psychiatrists"
                  className="btn-secondary group flex items-center justify-center space-x-3"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Find Experts</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">24/7 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">100% Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Certified Experts</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                      <p className="text-sm text-gray-500">Online • Ready to help</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-gray-700">
      Hi there! I'm here to support you. How are you feeling today?
    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                      I'm feeling anxious
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:border-blue-600 hover:text-blue-600 transition-colors">
                      Need support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-heading text-gray-900 mb-6">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-body-large text-gray-600">
              Everything you need for your mental wellness journey in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover text-center group">
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Psychiatrists Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-heading text-gray-900 mb-6">
              Meet Our Expert Psychiatrists
            </h2>
            <p className="text-body-large text-gray-600">
              Connect with licensed professionals who specialize in various mental health areas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card">
                  <div className="skeleton w-20 h-20 rounded-full mx-auto mb-4"></div>
                  <div className="skeleton h-6 w-3/4 mx-auto mb-2"></div>
                  <div className="skeleton h-4 w-1/2 mx-auto mb-4"></div>
                  <div className="skeleton h-4 w-full mb-2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              ))
            ) : featuredPsychiatrists.length > 0 ? (
              featuredPsychiatrists.map((psychiatrist) => (
                <div key={psychiatrist.id} className="card-hover text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{psychiatrist.name}</h3>
                  <p className="text-blue-600 mb-4">{psychiatrist.specialization}</p>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(psychiatrist.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600">({psychiatrist.rating})</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{psychiatrist.bio}</p>
                  <Link 
                    href={`/psychiatrists/${psychiatrist.id}`}
                    className="btn-outline w-full"
                  >
                    View Profile
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No psychiatrists available at the moment
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/psychiatrists" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Psychiatrists</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-heading text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-body-large text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have found support and healing through our platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Free Chat</span>
            </button>
            
            <Link 
              href="/psychiatrists"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <UserCheck className="w-5 h-5" />
              <span>Find Experts</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold">MindCare</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner in mental wellness and professional care.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/psychiatrists" className="hover:text-white transition-colors">Psychiatrists</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setIsChatOpen(true)} className="hover:text-white transition-colors">Chat Support</button></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Stay Connected</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">FB</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">TW</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">IG</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 MindCare. All rights reserved. Your mental health matters.</p>
          </div>
        </div>
      </footer>

      {/* Chat Bot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsChatOpen(false)}></div>
          <div className="absolute bottom-4 right-4 w-96 h-96">
            <ChatBot onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}