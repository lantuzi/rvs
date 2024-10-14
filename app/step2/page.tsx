'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingStep2() {
  const router = useRouter()
  const [components, setComponents] = useState<string[]>([])
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/configuration')
      const data = await response.json()
      setComponents(data.page2 || [])
    } catch (error) {
      console.error('Error loading configuration:', error)
      setComponents([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validate required fields based on components
    if (components.includes('birthdate') && (!day || !month || !year)) {
      setError('Please select your full birthdate')
      setIsLoading(false)
      return
    }

    if (components.includes('aboutMe') && !aboutMe) {
      setError('Please fill in the About Me field')
      setIsLoading(false)
      return
    }

    if (components.includes('address') && (!street || !city || !state || !zip)) {
      setError('Please fill in all address fields')
      setIsLoading(false)
      return
    }

    // Store data in localStorage
    if (components.includes('birthdate')) {
      localStorage.setItem('birthdate', `${year}-${month}-${day}`)
    }
    if (components.includes('aboutMe')) {
      localStorage.setItem('aboutMe', aboutMe)
    }
    if (components.includes('address')) {
      localStorage.setItem('streetAddress', street)
      localStorage.setItem('city', city)
      localStorage.setItem('state', state)
      localStorage.setItem('zip', zip)
    }

    // Navigate to next step
    router.push('/step3')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Tell us about yourself</h2>
          <p className="mt-2 text-sm text-gray-600">Step 2 of 3</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {components.includes('birthdate') && (
            <div className="space-y-2">
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
              <div className="flex space-x-2">
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Month</option>
                  {months.map((m, index) => (
                    <option key={m} value={String(index + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>
                <select
                  id="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Day</option>
                  {days.map(d => (
                    <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                  ))}
                </select>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {components.includes('aboutMe') && (
            <div>
              <label htmlFor="aboutMe">About Me</label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                rows={3}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Tell us about yourself"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
          )}
          {components.includes('address') && (
            <div className="space-y-2">
              <div>
                <label htmlFor="street">Street Address</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="1234 Main St"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="zip">ZIP Code</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="12345"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => router.push('/')}
            >
              Back
            </button>
            <button
              type="submit"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
