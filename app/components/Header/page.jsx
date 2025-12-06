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
    { label: 'Home', href: '/',  },
    
    { label: 'Psychiatrists', href: '/psychiatrists' },
    
    { label: 'Resources', href: '/resources' },
    { label: 'ChatBot', href: '/chatbot' },
  ]

  return (
     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MindCare AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-medium text-gray-900">{session.user?.name}</span>
                  <span className="text-xs text-gray-500">{session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
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
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}