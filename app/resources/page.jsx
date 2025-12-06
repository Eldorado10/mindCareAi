'use client'

import ResourceCard from '@/app/components/ResourceCard/page.jsx'

export default function ResourcesPage() {
  const resources = [
    {
      icon: "🧘",
      title: "Anxiety Management",
      description: "Guided exercises and techniques to manage anxiety",
      category: "Coping Skills",
      color: "blue",
      features: ["Breathing Exercises", "Grounding Techniques", "Anxiety Journal"]
    },
    {
      icon: "🌞",
      title: "Depression Support",
      description: "Tools and resources for depression management",
      category: "Mental Health",
      color: "purple",
      features: ["Mood Tracking", "Activity Scheduling", "Positive Psychology"]
    },
    {
      icon: "😴",
      title: "Sleep Hygiene",
      description: "Improve sleep quality with evidence-based methods",
      category: "Wellness",
      color: "green",
      features: ["Sleep Schedule", "Relaxation Techniques", "Sleep Diary"]
    },
    {
      icon: "🤝",
      title: "Relationship Skills",
      description: "Build healthy relationships and improve communication",
      category: "Social Health",
      color: "pink",
      features: ["Communication Tips", "Conflict Resolution", "Empathy Building"]
    },
    {
      icon: "💪",
      title: "Stress Management",
      description: "Practical strategies to handle stress effectively",
      category: "Wellness",
      color: "orange",
      features: ["Time Management", "Stress Relief", "Work-Life Balance"]
    },
    {
      icon: "🎯",
      title: "Goal Setting",
      description: "Set and achieve meaningful personal goals",
      category: "Personal Growth",
      color: "yellow",
      features: ["Goal Planning", "Progress Tracking", "Motivation Tips"]
    }
  ]

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              icon={resource.icon}
              title={resource.title}
              description={resource.description}
              category={resource.category}
              color={resource.color}
              features={resource.features}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
