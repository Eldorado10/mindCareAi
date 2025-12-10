'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  DollarSign, 
  Award,
  Globe,
  Shield,
  Calendar,
  Users,
  Heart
} from 'lucide-react'
import PsychiatristCard from '../components/psychiatrists/psychiatristsCard'
import FilterSidebar from '../components/psychiatrists/filterSidebar'
import { fetchPsychiatrists } from '@/lib/api-client'

export default function PsychiatristsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [psychiatrists, setPsychiatrists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecializations, setSelectedSpecializations] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [acceptsInsurance, setAcceptsInsurance] = useState(false)
  const [availableToday, setAvailableToday] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [filteredPsychiatrists, setFilteredPsychiatrists] = useState([])

  // Check authentication on mount
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setIsAuthenticated(true)
    setAuthLoading(false)
  }, [router])

  // Fetch psychiatrists from API
  useEffect(() => {
    if (!isAuthenticated) return

    async function loadPsychiatrists() {
      try {
        setLoading(true)
        const data = await fetchPsychiatrists()
        setPsychiatrists(data || [])
      } catch (error) {
        console.error('Error loading psychiatrists:', error)
        setPsychiatrists([])
      } finally {
        setLoading(false)
      }
    }
    loadPsychiatrists()
  }, [isAuthenticated])

  // Get all unique languages (or use defaults)
  const allLanguages = [...new Set((psychiatrists || []).flatMap(p => p.languages || ['English']))]
  const specializations = [...new Set((psychiatrists || []).map(p => p.specialization))]

  useEffect(() => {
    let results = psychiatrists || []

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(psy => 
        psy.name.toLowerCase().includes(query) ||
        (typeof psy.specialization === 'string' ? 
          psy.specialization.toLowerCase().includes(query) : 
          psy.specialization?.some(s => s.toLowerCase().includes(query)))
      )
    }

    // Apply specialization filter
    if (selectedSpecializations.length > 0) {
      results = results.filter(psy =>
        selectedSpecializations.some(spec => 
          (typeof psy.specialization === 'string' ? 
            psy.specialization.toLowerCase().includes(spec.toLowerCase()) :
            psy.specialization?.some(psySpec => 
              psySpec.toLowerCase().includes(spec.toLowerCase())
            ))
        )
      )
    }

    // Apply price filter
    results = results.filter(psy => 
      psy.consultationFee >= priceRange[0] && 
      psy.consultationFee <= priceRange[1]
    )

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return (b.experience || 0) - (a.experience || 0)
        case 'price-low':
          return a.consultationFee - b.consultationFee
        case 'price-high':
          return b.consultationFee - a.consultationFee
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredPsychiatrists(results)
  }, [searchQuery, selectedSpecializations, priceRange, sortBy, psychiatrists])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecializations([])
    setSelectedLanguages([])
    setPriceRange([0, 300])
    setAcceptsInsurance(false)
    setAvailableToday(false)
    setSortBy('rating')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect <span className="text-yellow-300">Psychiatrist</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10">
              Connect with licensed mental health professionals for personalized care
            </p>
            
            <div className="relative max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialization, or approach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {loading ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading psychiatrists...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">{psychiatrists.length}</span>
              </div>
              <div className="text-gray-600">Licensed Psychiatrists</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-3xl font-bold text-gray-900">4.8+</span>
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-3xl font-bold text-gray-900">15+</span>
              </div>
              <div className="text-gray-600">Years Avg Experience</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-3xl font-bold text-gray-900">6+</span>
              </div>
              <div className="text-gray-600">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar
              specializations={specializations}
              languages={allLanguages}
              selectedSpecializations={selectedSpecializations}
              setSelectedSpecializations={setSelectedSpecializations}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              acceptsInsurance={acceptsInsurance}
              setAcceptsInsurance={setAcceptsInsurance}
              availableToday={availableToday}
              setAvailableToday={setAvailableToday}
              clearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header with sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Psychiatrists
                  <span className="text-gray-600 ml-2">
                    ({filteredPsychiatrists.length} found)
                  </span>
                </h2>
                <p className="text-gray-600">
                  Browse through our verified mental health professionals
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Psychiatrists Grid */}
            {filteredPsychiatrists.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No psychiatrists found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPsychiatrists.map((psychiatrist) => (
                  <PsychiatristCard
                    key={psychiatrist.id}
                    psychiatrist={psychiatrist}
                  />
                ))}
              </div>
            )}

            {/* Features Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Why Choose Our Psychiatrists?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Verified Credentials</h4>
                  <p className="text-gray-600">All psychiatrists are licensed and background-checked</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Flexible Scheduling</h4>
                  <p className="text-gray-600">Book appointments that fit your schedule</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Personalized Care</h4>
                  <p className="text-gray-600">Treatment plans tailored to your unique needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}