import { Brain, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">MindCare AI</div>
                <div className="text-sm text-gray-400">AI Mental Health Companion</div>
              </div>
            </div>
            <p className="text-gray-400 mb-8">
              Providing accessible, confidential, and compassionate mental health support through advanced AI technology.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition">
                🐦
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition">
                📘
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition">
                💼
              </button>
              <button className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition">
                📷
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/chat" className="text-gray-400 hover:text-white transition">AI Chat</Link></li>
              <li><Link href="/tracker" className="text-gray-400 hover:text-white transition">Mood Tracker</Link></li>
              <li><Link href="/resources" className="text-gray-400 hover:text-white transition">Resources</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Mental Health Blog</Link></li>
              <li><Link href="/tools" className="text-gray-400 hover:text-white transition">Self-Help Tools</Link></li>
              <li><Link href="/meditations" className="text-gray-400 hover:text-white transition">Guided Meditations</Link></li>
              <li><Link href="/coping" className="text-gray-400 hover:text-white transition">Coping Strategies</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Emergency */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact & Emergency</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">support@mindcare.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">1-800-MIND-CARE</span>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <h4 className="font-bold text-red-400 mb-4">Emergency Contacts</h4>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold">Suicide Prevention</div>
                    <div className="text-2xl font-bold text-red-400">988</div>
                  </div>
                  <div>
                    <div className="font-semibold">Crisis Text Line</div>
                    <div className="text-2xl font-bold text-red-400">741741</div>
                  </div>
                  <div>
                    <div className="font-semibold">Emergency</div>
                    <div className="text-2xl font-bold text-red-400">911</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MindCare AI. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Always Compassionate</span>
              </div>
            </div>
            
            <div className="text-gray-400 text-sm">
              <span className="text-red-400">⚠️</span> Not a substitute for professional medical care
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}