import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
}

export async function GET() {
  const pool = new Pool(dbConfig)

  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM users ORDER BY id DESC')
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  } finally {
    await pool.end()
  }
}

