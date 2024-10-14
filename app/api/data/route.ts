import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const dbConfig = {
  user: 'postgres.kiihenmwpjtvgbktvvul',
  password: 'Lantuzi@2024',
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false // You might need this if you're using SSL
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

