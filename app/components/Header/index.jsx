'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Brain, 
  Menu, 
  X,
  LogOut,
  User,
  LogIn
} from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isAdmin = user?.role === 'admin'

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    document.cookie = 'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    document.cookie = 'user-data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    setUser(null)
    router.push('/')
  }

  const navItems = useMemo(() => {
    const baseItems = [
      { label: 'Home', href: '/' },
      { label: 'Psychiatrists', href: '/psychiatrists' },
      { label: 'Resources', href: '/resources' },
      { label: 'ChatBot', href: '/chatbot' },
    ]

    const dashboardItem = isAdmin
      ? { label: 'Admin Control Center', href: '/admin' }
      : { label: 'Dashboard', href: '/dashboard' }

    return [...baseItems, dashboardItem]
  }, [isAdmin])

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
                prefetch={false}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoading && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </div>
            )}
          </div>

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
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {!isLoading && user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-50">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-gray-700 font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={isAdmin ? '/admin' : '/dashboard'}
                      className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {isAdmin ? 'Admin Control Center' : 'Dashboard'}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
