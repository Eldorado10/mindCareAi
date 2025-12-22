'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  MessageCircle,
  TrendingUp,
  Clock4,
  Star,
  ChevronRight,
  UserCheck,
  Shield,
  HeartHandshake,
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Activity,
} from 'lucide-react'
import { fetchPsychiatrists } from '@/lib/api-client'

const useOnScreen = (options) => {
  const [ref, setRef] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, options)

    if (ref) {
      observer.observe(ref)
    }

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref, options])

  return [setRef, isVisible]
}

const getInitials = (name = '') => {
  const parts = name.toString().trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'DR'
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

const CountUp = ({ target, duration = 1.2, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 })
  const isNumber = typeof target === 'number'

  useEffect(() => {
    if (isVisible && isNumber) {
      let start = 0
      const end = target
      if (start === end) return

      let startTime = null
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        setCount(Math.round(progress * end * 10) / 10)
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }, [isVisible, target, duration, isNumber])

  if (!isNumber) {
    return <span ref={ref}>{target}</span>
  }

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

const TrustIndicator = ({ icon, value, label, color, delay = 0, suffix = '+' }) => {
  const Icon = icon
  return (
    <div
      className="glass text-center px-6 py-6 rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-primary)] shadow-sm">
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <h3 className="text-3xl font-semibold text-[var(--color-text-primary)]">
        <CountUp target={value} suffix={suffix} />
      </h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{label}</p>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  const Icon = icon
  return (
    <div className="glass h-full rounded-2xl p-6 shadow-md transition-transform duration-200 hover:-translate-y-1">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 text-[var(--color-primary)] shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{description}</p>
    </div>
  )
}

const PsychiatristCardSkeleton = () => (
  <div className="glass rounded-2xl p-6 shadow-md">
    <div className="mx-auto mb-4 h-24 w-24 animate-pulse rounded-full bg-slate-200" />
    <div className="mx-auto mb-2 h-5 w-32 animate-pulse rounded-full bg-slate-200" />
    <div className="mx-auto mb-4 h-4 w-24 animate-pulse rounded-full bg-slate-200" />
    <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-slate-200" />
    <div className="mx-auto h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
  </div>
)

export default function HomePage() {
  const router = useRouter()
  const [featuredPsychiatrists, setFeaturedPsychiatrists] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const stats = [
    { label: 'Guided conversations', value: 52000, suffix: '+', icon: MessageCircle },
    { label: 'Member satisfaction', value: 4.8, suffix: '/5', icon: Star },
    { label: 'Licensed experts', value: 180, suffix: '+', icon: Users },
    { label: 'Response time', value: '< 2 min', icon: Clock4, isStatic: true },
  ]

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

  useEffect(() => {
    async function loadFeaturedPsychiatrists() {
      try {
        const data = await fetchPsychiatrists()
        const topPsychiatrists =
          data?.sort((a, b) => (b.rating || 0) - (a.rating || 0))?.slice(0, 3) || []
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

  return (
    <div className="relative min-h-screen">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div
          className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/90 via-white/70 to-white/60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(91,139,245,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(157,113,232,0.14),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(76,215,182,0.12),transparent_35%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm">
                <Sparkles className="h-4 w-4" />
                Calm, guided support at your pace
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-5xl">
                  A calmer way to care for your mind.
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                  Blend human expertise with an always-on AI companion. Private, gentle, and designed to help you feel
                  supported between sessions.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/psychiatrists"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                >
                  Book a session
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => (user ? router.push('/chatbot') : router.push('/auth/signin'))}
                  className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                >
                  Talk to the AI coach
                  <BrainCircuit className="h-4 w-4 text-[var(--color-primary)]" />
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                  Encrypted, private sessions
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <HeartHandshake className="h-4 w-4 text-[var(--color-secondary)]" />
                  Human-reviewed care plans
                </div>
              </div>
            </div>
            <div className="glass relative rounded-3xl p-6 shadow-xl">
              <div className="absolute inset-x-10 top-3 h-2 rounded-full bg-gradient-to-r from-[var(--color-primary-400)] via-[var(--color-secondary-500)] to-[var(--color-accent-mint)] opacity-60 blur-2xl" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">Live support</p>
                    <p className="text-2xl font-semibold text-[var(--color-text-primary)]">We&apos;re online now</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-100)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                    Available
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { icon: MessageCircle, title: 'Instant chat', desc: 'AI + therapist guided replies' },
                    { icon: Activity, title: 'Daily check-ins', desc: 'Mood, sleep, and energy' },
                    { icon: Shield, title: 'Safe space', desc: 'HIPAA-grade encryption' },
                    { icon: HeartHandshake, title: 'Matched experts', desc: 'See the right specialist' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-[var(--color-primary)]" />
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 rounded-2xl bg-white/70 p-4 text-sm text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                    <Clock4 className="h-4 w-4 text-[var(--color-secondary-700)]" />
                    <span>Avg. response under 2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                    <UserCheck className="h-4 w-4 text-[var(--color-secondary-700)]" />
                    <span>Verified professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <TrustIndicator
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.isStatic ? '' : stat.suffix}
                label={stat.label}
                color={['#5B8BF5', '#9D71E8', '#4CD7B6', '#f59e0b'][idx]}
                delay={0.05 * idx}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Designed for gentle focus
              </p>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                Everything you need to feel supported
              </h2>
              <p className="max-w-2xl text-base text-[var(--color-text-secondary)]">
                Sessions feel like calm conversations. We keep the UI light, readable, and distraction-free.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-link)] hover:text-[var(--color-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
            >
              Explore mental health resources
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-6 w-6 text-[var(--color-primary)]" />
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Smart, gentle onboarding</h3>
              </div>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                A simple check-in meets you where you are, so the AI coach and your therapist understand your day without
                overwhelming forms.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Guided prompts tuned for calm',
                  'Pick chat, video, or voice',
                  'No noisy colors or harsh contrasts',
                  'Adaptive text for readability',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Shield,
                  title: 'Privacy first',
                  description: 'End-to-end encrypted chat, with clear consent for every share.',
                },
                {
                  icon: HeartHandshake,
                  title: 'Human touch',
                  description: 'Licensed psychiatrists and therapists with compassionate language.',
                },
                {
                  icon: UserCheck,
                  title: 'Right match',
                  description: 'Get paired based on specialty, style, and availability you choose.',
                },
                {
                  icon: TrendingUp,
                  title: 'Progress you can feel',
                  description: 'Micro goals, reflections, and visible trends without clutter.',
                },
              ].map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white/85 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">Care path</p>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
                A steady rhythm to your healing
              </h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-mint)]" />
              Prefer calmer motion? We keep animations subtle.
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Share how you feel',
                description: 'Two-minute check-in sets tone, capturing mood, energy, and any triggers today.',
              },
              {
                icon: ShieldCheck,
                title: 'Match to the right support',
                description: 'Pick self-guided with AI, or book with a verified psychiatrist who fits your style.',
              },
              {
                icon: TrendingUp,
                title: 'Stay on track',
                description: 'Set gentle goals, get reminders, and celebrate small wins without pressure.',
              },
            ].map((step, index) => (
              <div key={step.title} className="glass flex h-full flex-col rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-primary)] shadow-sm">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Featured experts
              </p>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                Meet the people behind your care
              </h2>
              <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Licensed psychiatrists and therapists who blend evidence-based care with empathy.
              </p>
            </div>
            <Link
              href="/psychiatrists"
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 py-2 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
            >
              View all experts
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => <PsychiatristCardSkeleton key={index} />)
              : featuredPsychiatrists.map((psychiatrist) => (
                  <div key={psychiatrist.id} className="glass rounded-2xl p-6 text-left shadow-md">
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[var(--color-primary-100)] bg-white text-xl font-semibold text-[var(--color-primary-700)] shadow-sm">
                        {getInitials(psychiatrist.name)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            {psychiatrist.name}
                          </h3>
                          <span className="rounded-full bg-[var(--color-primary-100)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
                            {Array.isArray(psychiatrist.specialization)
                              ? psychiatrist.specialization[0]
                              : psychiatrist.specialization}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {Array.isArray(psychiatrist.specialization)
                            ? psychiatrist.specialization.join(', ')
                            : psychiatrist.specialization}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(psychiatrist.rating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {psychiatrist.rating?.toFixed(1) || '4.8'}
                          </span>
                        </div>
                        <Link
                          href={`/psychiatrists/${psychiatrist.id}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-link)] hover:text-[var(--color-link-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                        >
                          View profile
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-secondary-500)] to-[var(--color-accent-mint)] px-8 py-12 shadow-xl">
            <div className="absolute inset-0 bg-white/15" aria-hidden />
            <div className="relative z-10 space-y-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Ready when you are
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">Let&apos;s take the next gentle step together</h2>
              <p className="max-w-3xl text-base text-white/90">
                Whether you want a quick AI check-in or a full session with a psychiatrist, we keep the experience calm,
                private, and easy to navigate.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/psychiatrists"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                >
                  Book with an expert
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => (user ? router.push('/chatbot') : router.push('/auth/signin'))}
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                >
                  Start AI check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
