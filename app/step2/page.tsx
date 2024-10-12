'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle } from "lucide-react"

export default function OnboardingStep2() {
  const router = useRouter()
  const [aboutMe, setAboutMe] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!aboutMe || !street || !city || !state || !zip) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    const zipRegex = /^\d{5}(-\d{4})?$/
    if (!zipRegex.test(zip)) {
      setError('Please enter a valid ZIP code')
      setIsLoading(false)
      return
    }

    // Store data in localStorage
    localStorage.setItem('aboutMe', aboutMe)
    localStorage.setItem('streetAddress', street)
    localStorage.setItem('city', city)
    localStorage.setItem('state', state)
    localStorage.setItem('zip', zip)

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
        <div className="flex justify-between mb-4">
          <div className="w-1/3 bg-blue-500 h-2 rounded-full"></div>
          <div className="w-1/3 bg-blue-500 h-2 rounded-full"></div>
          <div className="w-1/3 bg-gray-200 h-2 rounded-full"></div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="aboutMe">About Me</label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                rows={4}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Tell us about yourself..."
                value={aboutMe}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAboutMe(e.target.value)}
              />
            </div>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStreet(e.target.value)}
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
                placeholder="Anytown"
                value={city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
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
                placeholder="CA"
                value={state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZip(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => router.push('/onboarding')}
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