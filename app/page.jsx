'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  MessageCircle, 
  Heart, 
  Users, 
  Shield, 
  Activity,
  Star,
  ChevronRight,
  CheckCircle,
  Clock,
  Smartphone,
  TrendingUp,
  BookOpen,
  Headphones,
  Zap
} from 'lucide-react'
import ChatBot from "@/app/components/ChatBot/page.jsx"
import MoodTracker from '@/app/components/MoodTracker/page.jsx'
import TestimonialCard from '@/app/components/TestimonialCard/page.jsx'
import ResourceCard from '@/app/components/ResourceCard/page.jsx'
import FeatureCard from  '@/app/components/FeatureCard/page.jsx'
import StatsCounter from '@/app/components/StatsCounter/page.jsx'

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">24/7 AI Support Available</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Your Personal
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Mental Health AI
                </span>
                Companion
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl">
                Get instant, personalized mental health support from our advanced AI. 
                Always available, always understanding, always confidential.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  Start Free Chat
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Explore Resources
                </button>
              </div>
              
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No Sign-up Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Always Free</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-bold text-sm animate-pulse">
                  🤖 AI ONLINE
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">MindCare AI</h3>
                      <p className="text-gray-600">Your empathetic companion</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-2xl p-4 max-w-[80%]">
                      <p className="text-gray-800">Hello! I'm here to listen and support you. How are you feeling today? 💭</p>
                    </div>
                    
                    <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%] ml-auto">
                      <p className="text-gray-800">I've been feeling stressed about work lately...</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-2xl p-4 max-w-[80%]">
                      <p className="text-gray-800">I understand work stress can be overwhelming. Let's talk through it together. 🤝</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-xl hover:bg-blue-200 transition font-medium">
                        😊 Feeling Good
                      </button>
                      <button className="flex-1 bg-purple-100 text-purple-700 py-3 rounded-xl hover:bg-purple-200 transition font-medium">
                        🧘 Need Calm
                      </button>
                      <button className="flex-1 bg-green-100 text-green-700 py-3 rounded-xl hover:bg-green-200 transition font-medium">
                        💭 Talk It Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCounter 
              icon={<Users className="w-8 h-8 text-blue-600" />}
              end={10000}
              label="Users Supported"
              suffix="+"
            />
            <StatsCounter 
              icon={<MessageCircle className="w-8 h-8 text-purple-600" />}
              end={250000}
              label="Messages Exchanged"
              suffix="+"
            />
            <StatsCounter 
              icon={<Heart className="w-8 h-8 text-pink-600" />}
              end={98}
              label="Satisfaction Rate"
              suffix="%"
            />
            <StatsCounter 
              icon={<Clock className="w-8 h-8 text-green-600" />}
              end={24}
              label="Available Hours"
              suffix="/7"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose MindCare AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine advanced AI technology with evidence-based therapeutic techniques
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-blue-600" />}
              title="AI-Powered Insights"
              description="Our AI analyzes patterns to provide personalized mental health recommendations"
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-purple-600" />}
              title="Complete Privacy"
              description="End-to-end encryption ensures your conversations remain completely confidential"
              gradient="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={<Activity className="w-12 h-12 text-green-600" />}
              title="Mood Tracking"
              description="Track your emotional journey with detailed analytics and insights"
              gradient="from-green-500 to-green-600"
            />
            <FeatureCard
              icon={<Smartphone className="w-12 h-12 text-pink-600" />}
              title="Always Accessible"
              description="Available on all devices, 24/7, whenever you need support"
              gradient="from-pink-500 to-pink-600"
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-orange-600" />}
              title="Progress Analytics"
              description="Monitor your improvement with detailed progress reports"
              gradient="from-orange-500 to-orange-600"
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-yellow-600" />}
              title="Instant Support"
              description="Get immediate responses without waiting for appointments"
              gradient="from-yellow-500 to-yellow-600"
            />
          </div>
        </div>
      </section>

      {/* AI Chat Demo Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Experience the Future of <span className="text-blue-600">Mental Health Support</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI companion uses advanced natural language processing to understand your emotions, 
                provide empathetic responses, and offer evidence-based coping strategies.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Empathetic Conversations</h4>
                    <p className="text-gray-600">AI trained to respond with compassion and understanding</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Therapeutic Techniques</h4>
                    <p className="text-gray-600">Incorporates CBT, mindfulness, and positive psychology</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Personalized Support</h4>
                    <p className="text-gray-600">Adapts to your unique needs and preferences</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <ChatBot />
            </div>
          </div>
        </div>
      </section>

      {/* Mood Tracker Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Track Your <span className="text-purple-600">Emotional Journey</span>
            </h2>
            <p className="text-xl text-gray-600">
              Monitor patterns and gain insights into your mental wellbeing
            </p>
          </div>
          
          <MoodTracker />
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mental Health <span className="text-green-600">Resources</span>
            </h2>
            <p className="text-xl text-gray-600">
              Explore our library of tools and exercises
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResourceCard
              icon="🧘"
              title="Anxiety Management"
              description="Guided exercises and techniques to manage anxiety"
              category="Coping Skills"
              color="blue"
              features={["Breathing Exercises", "Grounding Techniques", "Anxiety Journal"]}
            />
            <ResourceCard
              icon="🌞"
              title="Depression Support"
              description="Tools and resources for depression management"
              category="Mental Health"
              color="purple"
              features={["Mood Tracking", "Activity Scheduling", "Positive Psychology"]}
            />
            <ResourceCard
              icon="😴"
              title="Sleep Hygiene"
              description="Improve sleep quality with evidence-based methods"
              category="Wellness"
              color="green"
              features={["Sleep Schedule", "Relaxation Techniques", "Sleep Diary"]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stories of <span className="text-pink-600">Healing & Growth</span>
            </h2>
            <p className="text-xl text-gray-600">
              Hear from people who found support with MindCare AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah M."
              role="Software Engineer"
              content="The AI companion helped me through a difficult period of burnout. It felt like talking to a real therapist."
              rating={5}
              avatar="👩‍💻"
            />
            <TestimonialCard
              name="James L."
              role="College Student"
              content="As a student struggling with anxiety, having 24/7 access to support has been life-changing."
              rating={5}
              avatar="👨‍🎓"
            />
            <TestimonialCard
              name="Priya K."
              role="Healthcare Worker"
              content="The mood tracker helped me identify patterns in my stress levels and develop better coping strategies."
              rating={4}
              avatar="👩‍⚕️"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Mental Wellness Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of others who have found support, understanding, and growth with MindCare AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                🚀 Start Free Chat Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition">
                📱 Download Mobile App
              </button>
            </div>
            
            <p className="text-blue-200 mt-8 text-sm">
              No credit card required • 100% confidential • No commitment
            </p>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform z-50 group"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <span className="font-semibold">Chat with AI</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">MindCare AI Chat</h3>
                  <p className="text-gray-600 text-sm">Online • Always here to listen</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-[500px] overflow-y-auto p-6">
              <ChatBot fullMode={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
