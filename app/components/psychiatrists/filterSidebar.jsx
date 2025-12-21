'use client'

import { Filter, X } from 'lucide-react'

export default function FilterSidebar({
  specializations,
  languages,
  selectedSpecializations,
  setSelectedSpecializations,
  selectedLanguages,
  setSelectedLanguages,
  priceRange,
  setPriceRange,
  maxPrice = 300,
  acceptsInsurance,
  setAcceptsInsurance,
  availableToday,
  setAvailableToday,
  clearFilters
}) {
  const toggleSpecialization = (spec) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== spec))
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec])
    }
  }

  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang))
    } else {
      setSelectedLanguages([...selectedLanguages, lang])
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Specializations</h4>
        <div className="space-y-2">
          {specializations.map((spec) => (
            <label key={spec} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedSpecializations.includes(spec)}
                onChange={() => toggleSpecialization(spec)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-blue-600 transition">
                {spec}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Languages</h4>
        <div className="space-y-2">
          {languages.map((lang) => (
            <label key={lang} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-blue-600 transition">
                {lang}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={acceptsInsurance}
            onChange={(e) => setAcceptsInsurance(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700 group-hover:text-blue-600 transition">
            Accepts Insurance
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={availableToday}
            onChange={(e) => setAvailableToday(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700 group-hover:text-blue-600 transition">
            Available Today
          </span>
        </label>
      </div>

      {/* Active Filters */}
      {(selectedSpecializations.length > 0 || selectedLanguages.length > 0 || acceptsInsurance || availableToday) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSpecializations.map((spec) => (
              <button
                key={spec}
                onClick={() => toggleSpecialization(spec)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {spec}
                <X className="w-3 h-3" />
              </button>
            ))}
            {selectedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {lang}
                <X className="w-3 h-3" />
              </button>
            ))}
            {acceptsInsurance && (
              <button
                onClick={() => setAcceptsInsurance(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm"
              >
                Accepts Insurance
                <X className="w-3 h-3" />
              </button>
            )}
            {availableToday && (
              <button
                onClick={() => setAvailableToday(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm"
              >
                Available Today
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
