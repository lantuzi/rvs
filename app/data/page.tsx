'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  birthdate: string
  about_me: string
  street_address: string
  city: string
  state: string
  zip: string
}

export default function DataPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      setError('Failed to load user data')
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchUsers()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Data</h1>
      <button 
        onClick={handleRefresh} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">ID</th>
            <th className="px-4 py-2 border-b text-left">Email</th>
            <th className="px-4 py-2 border-b text-left">Birthdate</th>
            <th className="px-4 py-2 border-b text-left">About Me</th>
            <th className="px-4 py-2 border-b text-left">Street Address</th>
            <th className="px-4 py-2 border-b text-left">City</th>
            <th className="px-4 py-2 border-b text-left">State</th>
            <th className="px-4 py-2 border-b text-left">ZIP</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 border-b">{user.id}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">{user.birthdate}</td>
              <td className="px-4 py-2 border-b">{user.about_me}</td>
              <td className="px-4 py-2 border-b">{user.street_address}</td>
              <td className="px-4 py-2 border-b">{user.city}</td>
              <td className="px-4 py-2 border-b">{user.state}</td>
              <td className="px-4 py-2 border-b">{user.zip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
