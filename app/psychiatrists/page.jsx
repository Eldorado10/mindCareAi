'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpDown,
  BadgeCheck,
  Calendar,
  ChevronRight,
  Clock,
  Globe,
  HeartHandshake,
  Search,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  Video
} from 'lucide-react'
import PsychiatristCard from '../components/psychiatrists/psychiatristsCard'
import FilterSidebar from '../components/psychiatrists/filterSidebar'
import { fetchPsychiatrists } from '@/lib/api-client'

const toArray = (value) => {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []
  return [value]
}

const normalizeText = (value) => (value ?? '').toString().trim().toLowerCase()

const getFee = (psychiatrist) => {
  const fee = Number(
    psychiatrist.consultationFee ??
      psychiatrist.consultation_fee ??
      psychiatrist.fee ??
      0
  )
  return Number.isFinite(fee) ? fee : 0
}

const getRating = (psychiatrist) => {
  const rating = Number(psychiatrist.rating ?? 0)
  return Number.isFinite(rating) ? rating : 0
}

const getExperience = (psychiatrist) => {
  const experience = Number(psychiatrist.experience ?? 0)
  return Number.isFinite(experience) ? experience : 0
}

const hasInsurance = (psychiatrist) =>
  Boolean(
    psychiatrist.acceptsInsurance ??
      psychiatrist.accepts_insurance ??
      psychiatrist.insurance ??
      false
  )

const isAvailableNow = (psychiatrist) =>
  Boolean(
    psychiatrist.availableToday ??
      psychiatrist.available_today ??
      psychiatrist.isOnline ??
      false
  )

const PsychiatristCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-44 bg-neutral-200"></div>
    <div className="p-6 space-y-3">
      <div className="h-5 w-3/4 bg-neutral-200 rounded"></div>
      <div className="h-4 w-1/2 bg-neutral-200 rounded"></div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
        <div className="h-6 w-16 bg-neutral-200 rounded-full"></div>
      </div>
      <div className="h-10 bg-neutral-200 rounded-xl"></div>
    </div>
  </div>
)

export default function PsychiatristsPage() {
  const [psychiatrists, setPsychiatrists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecializations, setSelectedSpecializations] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [maxPrice, setMaxPrice] = useState(300)
  const [acceptsInsurance, setAcceptsInsurance] = useState(false)
  const [availableToday, setAvailableToday] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [filteredPsychiatrists, setFilteredPsychiatrists] = useState([])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const fees = (psychiatrists || [])
      .map((psy) => getFee(psy))
      .filter((fee) => Number.isFinite(fee))

    const highestFee = fees.length ? Math.max(300, ...fees) : 300
    setMaxPrice(highestFee)
    setPriceRange(([min]) => [Math.min(min ?? 0, highestFee), highestFee])
  }, [psychiatrists])

  const specializations = useMemo(() => {
    const list = (psychiatrists || []).flatMap((psy) => toArray(psy.specialization))
    return [...new Set(list.filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [psychiatrists])

  const allLanguages = useMemo(() => {
    const list = (psychiatrists || []).flatMap((psy) => toArray(psy.languages))
    return [...new Set(list.filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [psychiatrists])

  const languageOptions = allLanguages.length ? allLanguages : ['English']
  const defaultSpecializations = ['Anxiety', 'Depression', 'ADHD', 'PTSD', 'Sleep', 'Stress']
  const quickSpecializations = (specializations.length ? specializations : defaultSpecializations).slice(0, 6)

  const metrics = useMemo(() => {
    const ratings = (psychiatrists || [])
      .map((psy) => getRating(psy))
      .filter((rating) => rating > 0)
    const experiences = (psychiatrists || [])
      .map((psy) => getExperience(psy))
      .filter((experience) => experience > 0)

    const averageRating = ratings.length
      ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
      : '4.8'
    const averageExperience = experiences.length
      ? Math.round(experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length)
      : 12

    return {
      averageRating,
      averageExperience,
      psychiatristCount: psychiatrists.length,
      languageCount: Math.max(allLanguages.length, 1),
      availableCount: psychiatrists.filter((psy) => isAvailableNow(psy)).length
    }
  }, [psychiatrists, allLanguages.length])

  const topPsychiatrist = useMemo(() => {
    const list = filteredPsychiatrists.length ? filteredPsychiatrists : psychiatrists
    if (!list.length) return null
    return list.reduce((best, current) =>
      getRating(current) > getRating(best) ? current : best
    )
  }, [filteredPsychiatrists, psychiatrists])

  useEffect(() => {
    const normalizedSearch = normalizeText(searchQuery)
    const selectedSpecs = selectedSpecializations.map(normalizeText).filter(Boolean)
    const selectedLangs = selectedLanguages.map(normalizeText).filter(Boolean)

    let results = psychiatrists || []

    if (normalizedSearch) {
      results = results.filter((psy) => {
        const searchTarget = [
          psy.name,
          psy.title,
          ...toArray(psy.specialization),
          ...toArray(psy.languages)
        ]
          .filter(Boolean)
          .map(normalizeText)
          .join(' ')
        return searchTarget.includes(normalizedSearch)
      })
    }

    if (selectedSpecs.length > 0) {
      results = results.filter((psy) => {
        const specs = toArray(psy.specialization).map(normalizeText)
        return selectedSpecs.some((spec) =>
          specs.some((psySpec) => psySpec && psySpec.includes(spec))
        )
      })
    }

    if (selectedLangs.length > 0) {
      results = results.filter((psy) => {
        const langs = toArray(psy.languages).map(normalizeText)
        return selectedLangs.some((lang) =>
          langs.some((psyLang) => psyLang && psyLang.includes(lang))
        )
      })
    }

    results = results.filter((psy) => {
      const fee = getFee(psy)
      return fee >= priceRange[0] && fee <= priceRange[1]
    })

    if (acceptsInsurance) {
      results = results.filter((psy) => hasInsurance(psy))
    }

    if (availableToday) {
      results = results.filter((psy) => isAvailableNow(psy))
    }

    const sortedResults = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return getRating(b) - getRating(a)
        case 'experience':
          return getExperience(b) - getExperience(a)
        case 'price-low':
          return getFee(a) - getFee(b)
        case 'price-high':
          return getFee(b) - getFee(a)
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        default:
          return 0
      }
    })

    setFilteredPsychiatrists(sortedResults)
  }, [
    searchQuery,
    selectedSpecializations,
    selectedLanguages,
    priceRange,
    sortBy,
    psychiatrists,
    acceptsInsurance,
    availableToday
  ])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecializations([])
    setSelectedLanguages([])
    setPriceRange([0, maxPrice])
    setAcceptsInsurance(false)
    setAvailableToday(false)
    setSortBy('rating')
  }

  const toggleQuickSpecialization = (spec) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((item) => item !== spec) : [...prev, spec]
    )
  }

  const activeFilterCount =
    selectedSpecializations.length +
    selectedLanguages.length +
    (acceptsInsurance ? 1 : 0) +
    (availableToday ? 1 : 0)

  const trustHighlights = [
    {
      title: 'Vetted Experts',
      description: 'Board-certified and background-checked',
      icon: BadgeCheck
    },
    {
      title: 'Human-first Care',
      description: 'Match by goals, approach, and availability',
      icon: HeartHandshake
    },
    {
      title: 'Video or In-person',
      description: 'Flexible options that fit your schedule',
      icon: Video
    },
    {
      title: 'Private and Secure',
      description: 'HIPAA-ready data protection',
      icon: Shield
    }
  ]

  const statCards = [
    {
      label: 'Licensed Psychiatrists',
      value: metrics.psychiatristCount || 0,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      label: 'Average Rating',
      value: metrics.averageRating,
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-100'
    },
    {
      label: 'Avg Experience',
      value: `${metrics.averageExperience}+ yrs`,
      icon: Stethoscope,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100'
    },
    {
      label: 'Languages Supported',
      value: `${metrics.languageCount}+`,
      icon: Globe,
      color: 'text-sky-500',
      bg: 'bg-sky-100'
    }
  ]

  const careSteps = [
    {
      title: 'Share your needs',
      description: 'Tell us your goals, preferences, and schedule.',
      icon: Sparkles
    },
    {
      title: 'Compare the best fits',
      description: 'Review profiles, ratings, and specialties with confidence.',
      icon: Calendar
    },
    {
      title: 'Meet securely',
      description: 'Book a private video or in-person session.',
      icon: Video
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-light">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-80"></div>
        <div className="absolute inset-0 pointer-events-none">
          <span className="sparkle animate-sparkle" style={{ top: '18%', left: '12%' }} aria-hidden />
          <span className="sparkle animate-sparkle" style={{ top: '40%', right: '15%' }} aria-hidden />
          <span className="sparkle animate-sparkle" style={{ bottom: '16%', left: '45%' }} aria-hidden />
        </div>
        <div className="absolute -top-20 -right-32 w-72 h-72 bg-white/20 blur-3xl rounded-full" aria-hidden />
        <div className="absolute -bottom-24 left-10 w-64 h-64 bg-white/10 blur-3xl rounded-full" aria-hidden />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="text-white animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Personalized matches in minutes</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mt-6 mb-4">
                Find the psychiatrist who fits your life
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Browse trusted professionals, compare approaches, and book a session that works for you.
              </p>

              <div className="mt-8 space-y-4">
                <div className="glass rounded-2xl p-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                    <input
                      type="text"
                      placeholder="Search by name, specialization, or approach..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl text-base md:text-lg focus:outline-none bg-white/95 text-neutral-dark"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSpecializations.map((spec) => {
                    const isActive = selectedSpecializations.includes(spec)
                    return (
                      <button
                        key={spec}
                        onClick={() => toggleQuickSpecialization(spec)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                          isActive
                            ? 'bg-white text-primary border-white'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {spec}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="soft-card p-6 rounded-3xl bg-white/95 shadow-soft-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Top match today</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">
                      {topPsychiatrist ? getRating(topPsychiatrist).toFixed(1) : '4.9'}
                    </span>
                  </div>
                </div>

                {topPsychiatrist ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://i.pravatar.cc/200?img=47"
                        alt={topPsychiatrist.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-white shadow-soft-1"
                      />
                      <div>
                        <p className="text-lg font-bold text-neutral-dark">
                          {topPsychiatrist.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {Array.isArray(topPsychiatrist.specialization)
                            ? topPsychiatrist.specialization.join(', ')
                            : topPsychiatrist.specialization || 'Psychiatry'}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {toArray(topPsychiatrist.languages)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((language) => (
                              <span
                                key={language}
                                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600"
                              >
                                {language}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-neutral-500">Starting at</div>
                      <div className="text-lg font-bold text-neutral-dark">${getFee(topPsychiatrist)}</div>
                    </div>
                    <Link
                      href={`/psychiatrists/${topPsychiatrist.id}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                    >
                      View profile
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 text-neutral-500 text-sm">
                    Loading the top rated psychiatrists near you...
                  </div>
                )}
              </div>

              <div className="soft-card p-4 rounded-2xl bg-white/90 mt-6 md:mt-8 md:absolute md:-bottom-12 md:right-4 md:w-[82%]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Fast scheduling</p>
                    <p className="text-lg font-semibold text-neutral-dark">
                      Same-week appointments available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustHighlights.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="soft-card p-5 rounded-2xl bg-white/95 border border-white/60 animate-fade-in-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-dark">{item.title}</h3>
                  <p className="text-sm text-neutral-500">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="soft-card p-5 rounded-2xl bg-white/95 border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-neutral-dark">{stat.value}</p>
                      <p className="text-sm text-neutral-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="results" className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <FilterSidebar
              specializations={specializations}
              languages={languageOptions}
              selectedSpecializations={selectedSpecializations}
              setSelectedSpecializations={setSelectedSpecializations}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              acceptsInsurance={acceptsInsurance}
              setAcceptsInsurance={setAcceptsInsurance}
              availableToday={availableToday}
              setAvailableToday={setAvailableToday}
              clearFilters={clearFilters}
            />
          </div>

          <div className="lg:w-3/4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">
                  Available Psychiatrists
                </h2>
                <p className="text-neutral-500">
                  {loading ? 'Loading expert matches...' : `${filteredPsychiatrists.length} found`}
                  {activeFilterCount > 0 ? ` | ${activeFilterCount} filters active` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Clear filters
                  </button>
                )}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-soft-1">
                  <ArrowUpDown className="w-4 h-4 text-neutral-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm font-medium text-neutral-700 focus:outline-none"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="experience">Most Experienced</option>
                    <option value="price-low">Lowest Price</option>
                    <option value="price-high">Highest Price</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {!loading && topPsychiatrist && filteredPsychiatrists.length > 0 && (
              <div className="soft-card p-6 rounded-3xl bg-white/95 border border-white/60 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      Featured match for you
                    </div>
                    <h3 className="text-xl font-bold text-neutral-dark">
                      {topPsychiatrist.name}
                    </h3>
                    <p className="text-neutral-500 mt-1">
                      {Array.isArray(topPsychiatrist.specialization)
                        ? topPsychiatrist.specialization.join(', ')
                        : topPsychiatrist.specialization || 'Psychiatry'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-600">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        {getRating(topPsychiatrist).toFixed(1)} rating
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        {getExperience(topPsychiatrist)} years experience
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-4 h-4 text-sky-500" />
                        {toArray(topPsychiatrist.languages).slice(0, 2).join(', ') || 'English'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">From</p>
                      <p className="text-2xl font-bold text-neutral-dark">${getFee(topPsychiatrist)}</p>
                    </div>
                    <Link
                      href={`/psychiatrists/${topPsychiatrist.id}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold inline-flex items-center gap-2 shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <PsychiatristCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredPsychiatrists.length === 0 ? (
              <div className="soft-card p-12 rounded-3xl text-center bg-white/95 border border-white/60">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-dark mb-2">No psychiatrists found</h3>
                <p className="text-neutral-500 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPsychiatrists.map((psychiatrist) => (
                  <PsychiatristCard
                    key={psychiatrist.id ?? psychiatrist._id ?? psychiatrist.name}
                    psychiatrist={psychiatrist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
              Care that meets you where you are
            </h3>
            <p className="text-lg text-neutral-500">
              A modern, flexible path to getting the right support without the friction.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {careSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="soft-card p-6 rounded-2xl bg-white/95 border border-white/60 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-dark mb-2">{step.title}</h4>
                  <p className="text-neutral-500">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-dark text-white p-10 md:p-14">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(circle at top left, rgba(76, 215, 182, 0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(91, 139, 245, 0.35), transparent 55%)'
              }}
              aria-hidden
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-accent mb-4">
                <Shield className="w-6 h-6" />
                <span className="text-sm uppercase tracking-wide">MindCare AI network</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to book your first session?
              </h3>
              <p className="text-lg text-white/80 max-w-2xl mb-8">
                Secure, private, and built around your schedule. Choose a psychiatrist and get support this week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    document.getElementById('results')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    })
                  }
                  className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold px-6 py-3 rounded-xl shadow-soft-2 transition hover:-translate-y-0.5 hover:shadow-soft-3"
                >
                  Browse availability
                </button>
                <Link
                  href="/chatbot"
                  className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Ask the AI assistant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

