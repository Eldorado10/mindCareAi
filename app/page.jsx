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
  BrainCircuit
} from 'lucide-react'
import { fetchPsychiatrists } from '@/lib/api-client'

// Custom hook for viewport visibility
const useOnScreen = (options) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isVisible];
};


const Counter = ({ to, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = parseInt(to.replace(/,/g, ''));
      if (start === end) return;

      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [to, duration, isVisible]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
};

const TrustIndicator = ({ icon, value, label, color, delay = 0 }) => {
  const Icon = icon;
  return (
    <div className="soft-card text-center animate-fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <Icon className={`w-12 h-12 mx-auto mb-4`} style={{ color }} />
      <h3 className="text-4xl font-bold text-neutral-dark"><Counter to={value} /></h3>
      <p className="text-neutral-500">{label}</p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const Icon = icon;
  return (
    <div className="soft-card p-8 rounded-2xl shadow-soft-1 hover:shadow-soft-3 transform transition-all duration-300 custom-ease animate-fade-in-up" style={{ perspective: '1000px', animationDelay: `${delay}s` }}>
      <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-4 text-neutral-dark">{title}</h3>
      <p className="text-neutral-500">{description}</p>
    </div>
  );
};

const PsychiatristCardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-white shadow-soft-1">
    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-neutral-200 animate-pulse"></div>
    <div className="h-6 w-3/4 mx-auto mb-2 bg-neutral-200 rounded animate-pulse"></div>
    <div className="h-4 w-1/2 mx-auto mb-4 bg-neutral-200 rounded animate-pulse"></div>
    <div className="h-4 w-full mb-2 bg-neutral-200 rounded animate-pulse"></div>
    <div className="h-4 w-2/3 mx-auto bg-neutral-200 rounded animate-pulse"></div>
  </div>
);

export default function HomePage() {
  const router = useRouter()
  const [featuredPsychiatrists, setFeaturedPsychiatrists] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

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
        const topPsychiatrists = data
          ?.sort((a, b) => (b.rating || 0) - (a.rating || 0))
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

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 gradient-bg opacity-70"></div>
        <div className="absolute inset-0 pointer-events-none">
          <span className="sparkle animate-sparkle" style={{ top: '15%', left: '20%' }} aria-hidden />
          <span className="sparkle animate-sparkle" style={{ top: '35%', right: '25%' }} aria-hidden />
          <span className="sparkle animate-sparkle" style={{ bottom: '20%', left: '50%' }} aria-hidden />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-count-up">Find Your Path to Mental Wellness</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-count-up" style={{ animationDelay: '0.3s' }}>
            Connect with compassionate, professional psychiatrists and therapists from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-count-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/psychiatrists" className="bg-white text-primary font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
              Book an Appointment
            </Link>
            <button 
              onClick={() => user ? router.push('/chatbot') : router.push('/auth/signin')}
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              Chat with AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TrustIndicator icon={Users} value="10,000" label="Happy Users" color="#5B8BF5" delay={0} />
            <TrustIndicator icon={MessageCircle} value="50,000" label="Sessions Conducted" color="#9D71E8" delay={0.1} />
            <TrustIndicator icon={TrendingUp} value="95" label="Success Rate (%)" color="#4CD7B6" delay={0.2} />
            <TrustIndicator icon={Clock4} value="2" label="Avg. Response Time (min)" color="#F59E0B" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-dark">Why Choose MindCare AI?</h2>
            <p className="text-lg text-neutral-500">
              We provide a secure, confidential, and personalized mental health care experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Shield} title="Confidential & Secure" description="Your privacy is our top priority. All communications are encrypted and confidential." delay={0} />
            <FeatureCard icon={UserCheck} title="Verified Professionals" description="Connect with licensed and vetted psychiatrists and therapists with proven track records." delay={0.15} />
            <FeatureCard icon={HeartHandshake} title="Personalized Matching" description="Our smart algorithm matches you with the right professional for your specific needs." delay={0.3} />
          </div>
        </div>
      </section>

      {/* Featured Psychiatrists */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-dark">Meet Our Top Psychiatrists</h2>
            <p className="text-lg text-neutral-500">
              Handpicked professionals dedicated to your mental well-being.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => <PsychiatristCardSkeleton key={index} />)
            ) : (
              featuredPsychiatrists.map((psychiatrist, index) => (
                <div
                  key={psychiatrist.id}
                  className="soft-card p-6 rounded-2xl shadow-soft-1 text-center transform transition-all duration-300 custom-ease animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <img src="https://i.pravatar.cc/150?img=32" alt={psychiatrist.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary" />
                  <h3 className="text-xl font-bold text-neutral-dark">{psychiatrist.name}</h3>
                  <p className="text-primary mb-4">{Array.isArray(psychiatrist.specialization) ? psychiatrist.specialization.join(', ') : psychiatrist.specialization}</p>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(psychiatrist.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <Link href={`/psychiatrists/${psychiatrist.id}`} className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2">
                    <span>View Profile</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/psychiatrists" className="bg-secondary text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
              View All Experts
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="soft-card relative px-10 py-16 max-w-3xl mx-auto animate-fade-in-up" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
            <div className="glow-ring absolute inset-0 opacity-30 pointer-events-none"></div>
            <BrainCircuit className="w-16 h-16 mx-auto mb-6 text-accent relative z-10" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to Take the Next Step?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Your journey to a healthier mind starts here. Book your first session today and experience the change.
            </p>
            <Link
              href="/psychiatrists"
              className="bg-accent text-neutral-dark font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 animate-glow-pulse relative z-10 inline-flex items-center justify-center gap-2"
            >
              Book a Session Now
            </Link>
          </div>
        </div>
      </section>
    </div>                                      
  )
}
