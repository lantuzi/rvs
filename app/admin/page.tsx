'use client'

import { useState, useEffect } from 'react'

const components = [
  { id: 'birthdate', name: 'Birthdate' },
  { id: 'aboutMe', name: 'About Me' },
  { id: 'address', name: 'Address' }
]

export default function AdminPage() {
  const [page2Components, setPage2Components] = useState<string[]>([])
  const [page3Components, setPage3Components] = useState<string[]>([])

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/configuration')
      const data = await response.json()
      setPage2Components(data.page2 || [])
      setPage3Components(data.page3 || [])
    } catch (error) {
      console.error('Error fetching configuration:', error)
      alert('Failed to load configuration')
    }
  }

  const handleComponentToggle = (componentId: string, page: number) => {
    if (page === 2) {
      setPage2Components(prev => 
        prev.includes(componentId) 
          ? prev.filter(id => id !== componentId)
          : [...prev, componentId]
      )
    } else {
      setPage3Components(prev => 
        prev.includes(componentId) 
          ? prev.filter(id => id !== componentId)
          : [...prev, componentId]
      )
    }
  }

  const handleSubmit = async () => {
    if (page2Components.length === 0 || page3Components.length === 0) {
      alert('Each page must have at least one component')
      return
    }

    try {
      const response = await fetch('/api/admin/configuration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page2: page2Components, page3: page3Components })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        alert('Configuration saved successfully')
      } else {
        throw new Error(data.error || 'Unexpected response from server')
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert(`Failed to save configuration: ${(error as Error).message || 'An unknown error occurred'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-6">Admin Configuration</h1>
          <div className="mb-6">
            <h2 className="text-xl mb-2">Page 2 Components</h2>
            {components.map(component => (
              <label key={component.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={page2Components.includes(component.id)}
                  onChange={() => handleComponentToggle(component.id, 2)}
                />
                <span>{component.name}</span>
              </label>
            ))}
          </div>
          <div className="mb-6">
            <h2 className="text-xl mb-2">Page 3 Components</h2>
            {components.map(component => (
              <label key={component.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={page3Components.includes(component.id)}
                  onChange={() => handleComponentToggle(component.id, 3)}
                />
                <span>{component.name}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
