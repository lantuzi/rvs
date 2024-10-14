'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingStep3() {
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  useEffect(() => {
    fetchConfiguration()
    loadDataFromLocalStorage()
  }, [])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/configuration')
      const data = await response.json()
      setComponents(data.page3 || [])
    } catch (error) {
      console.error('Error loading configuration:', error)
      setComponents([])
    }
  }
  const loadDataFromLocalStorage = () => {
    setAboutMe(localStorage.getItem('aboutMe') || '')
    setStreet(localStorage.getItem('streetAddress') || '')
    setCity(localStorage.getItem('city') || '')
    setState(localStorage.getItem('state') || '')
    setZip(localStorage.getItem('zip') || '')
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

    // Validate birthdate if it's included
    if (components.includes('birthdate')) {
      const birthDate = new Date(`${year}-${month}-${day}`)
      if (isNaN(birthDate.getTime())) {
        setError('Please enter a valid date')
        setIsLoading(false)
        return
      }

      const age = new Date().getFullYear() - birthDate.getFullYear()
      if (age < 13) {
        setError('You must be at least 13 years old to register')
        setIsLoading(false)
        return
      }
    }

    try {
      // Retrieve data from previous steps and current step
      const email = localStorage.getItem('email')
      const password = localStorage.getItem('password')
      
      // Construct birthdate string if birthdate component is present
      let birthdate = null
      if (components.includes('birthdate')) {
        birthdate = `${year}-${month}-${day}`
      } else {
        // If birthdate is not on this page, try to get it from localStorage
        birthdate = localStorage.getItem('birthdate')
      }

      // Prepare the request body
      const requestBody: any = { 
        email, 
        password,
        birthdate,
        aboutMe,
        streetAddress: street,
        city,
        state,
        zip
      }

      console.log('Sending request to /api/register with body:', requestBody)

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('Response status:', response.status)
      console.log('Response status text:', response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response body:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        // Clear localStorage
        localStorage.clear()
        // Show success popup
        setShowSuccessPopup(true)
      } else {
        throw new Error(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false)
    // Optionally, you can redirect to another page here
    // router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">Step 3 of 3</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {components.includes('birthdate') && (
            <div className="rounded-md shadow-sm space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="month">Month</label>
                  <select 
                    id="month" 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>Month</option>
                    {months.map((m, index) => (
                      <option key={m} value={String(index + 1).padStart(2, '0')}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="day">Day</label>
                  <select 
                    id="day" 
                    value={day} 
                    onChange={(e) => setDay(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>Day</option>
                    {days.map(d => (
                      <option key={d} value={String(d).padStart(2, '0')}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="year">Year</label>
                  <select 
                    id="year" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>Year</option>
                    {years.map(y => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {components.includes('aboutMe') && (
            <div>
              <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700">About Me</label>
              <textarea
                id="aboutMe"
                name="aboutMe"
                rows={3}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us about yourself"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
          )}

          {components.includes('address') && (
            <div className="space-y-2">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="1234 Main St"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              onClick={() => router.push('/step2')}
            >
              Back
            </button>
            <button
              type="submit"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Complete'}
            </button>
          </div>
        </form>

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Registration Successful!</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Your account has been successfully created.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    id="ok-btn"
                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    onClick={closeSuccessPopup}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}