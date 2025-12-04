'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Brain, 
  Menu, 
  X, 
  User,
  LogOut,
  Settings,
  Calendar,
  MessageSquare,
  BookOpen
} from 'lucide-react'

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'AI Chat', href: '/chat', icon: '🤖' },
    { label: 'Psychiatrists', href: '/psychiatrists', icon: '👨‍⚕️' },
    { label: 'Resources', href: '/resources', icon: '📚' },
    { label: 'Emergency', href: '/emergency', icon: '🚨' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindCare AI
              </div>
              <div className="text-xs text-gray-500">Mental Health Companion</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {session && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
              >
                <span className="text-lg">📊</span>
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-2xl hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-gray-900">{session.user?.name}</div>
                    <div className="text-sm text-gray-500">{session.user?.email}</div>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-bold text-gray-900">{session.user?.name}</div>
                      <div className="text-sm text-gray-500 truncate">{session.user?.email}</div>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      href="/appointments"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Appointments</span>
                    </Link>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl">📊</span>
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-red-50 text-red-600"
                    >
                      <span className="text-xl">🚪</span>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Link
                      href="/auth/login"
                      className="block text-center py-3 text-blue-600 font-medium border border-blue-600 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}