'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ResourceCard from '@/app/components/ResourceCard'
import { fetchResources } from '@/lib/api-client'

export default function ResourcesPage() {
  const router = useRouter()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication first
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        router.replace('/auth/signin')
        return
      }
      setIsAuthenticated(true)
    }

    async function loadResources() {
      try {
        setLoading(true)
        const data = await fetchResources()
        // Transform features from JSON string to array if needed
        const transformedData = (data || []).map(resource => {
          let features = resource.features
          
          // Handle features parsing
          if (typeof features === 'string') {
            try {
              features = JSON.parse(features)
            } catch (e) {
              features = []
            }
          }
          
          // Ensure features is always an array
          if (!Array.isArray(features)) {
            features = []
          }
          
          return {
            ...resource,
            features
          }
        })
        setResources(transformedData)
      } catch (error) {
        console.error('Error loading resources:', error)
        setResources([])
      } finally {
        setLoading(false)
      }
    }
    loadResources()
  }, [router])

  // Show loading while checking authentication
  if (!isAuthenticated && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Mental Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Resources</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive library of tools, exercises, and resources to support your mental wellness journey
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No resources available at this moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                icon={resource.icon}
                title={resource.title}
                description={resource.description}
                category={resource.category}
                color={resource.color}
                features={resource.features}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
