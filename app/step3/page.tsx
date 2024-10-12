'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OnboardingStep3() {
  const router = useRouter()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November',
    'December'
  ]
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!day || !month || !year) {
      setError('Please select your full birthdate')
      setIsLoading(false)
      return
    }

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

    try {
      // Retrieve data from previous steps
      const email = localStorage.getItem('email')
      const password = localStorage.getItem('password')
      const aboutMe = localStorage.getItem('aboutMe')
      const streetAddress = localStorage.getItem('streetAddress')
      const city = localStorage.getItem('city')
      const state = localStorage.getItem('state')
      const zip = localStorage.getItem('zip')

      // Format the birthdate correctly
      const birthdate = `${year}-${month}-${day}`

      const requestBody = {
        email,
        password,
        aboutMe,
        streetAddress,
        city,
        state,
        zip,
        birthdate,
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
        // Show success popup instead of redirecting
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">When's your birthday?</h2>
          <p className="mt-2 text-sm text-gray-600">Step 3 of 3</p>
        </div>
        <div className="flex justify-between mb-4">
          <div className="w-1/3 bg-blue-500 h-2 rounded-full"></div>
          <div className="w-1/3 bg-blue-500 h-2 rounded-full"></div>
          <div className="w-1/3 bg-blue-500 h-2 rounded-full"></div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="month">Month</label>
                <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
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
                <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
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
                <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
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
              onClick={() => router.push('/onboarding/step2')}
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
