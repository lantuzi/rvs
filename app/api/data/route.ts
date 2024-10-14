import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const connectionString = 'postgresql://postgres.kiihenmwpjtvgbktvvul:Lantuzi@2024@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'

export async function GET() {
  console.log('API route called')
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  
  try {
    console.log('Attempting to connect to database')
    const client = await pool.connect()
    try {
      console.log('Connected to database, executing query')
      const result = await client.query('SELECT * FROM users')
      console.log(`Query executed, ${result.rows.length} rows returned`)
      return NextResponse.json(result.rows)
    } finally {
      client.release()
      console.log('Database connection released')
    }
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  } finally {
    await pool.end()
    console.log('Pool ended')
  }
}
