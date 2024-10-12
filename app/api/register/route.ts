import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection configuration
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
  return NextResponse.json({ message: "GET request received" })
}

export async function POST(request: Request) {
  const body = await request.json()
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }

  const {
    email,
    password,
    aboutMe,
    streetAddress,
    city,
    state,
    zip,
    birthdate
  } = body

  const pool = new Pool(dbConfig)

  try {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const insertQuery = `
        INSERT INTO users (email, password, about_me, street_address, city, state, zip, birthdate)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `
      await client.query(insertQuery, [email, password, aboutMe, streetAddress, city, state, zip, birthdate])
      await client.query('COMMIT')
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error inserting user data:', error)
      return NextResponse.json({ error: 'Failed to register user' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error connecting to database:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  } finally {
    await pool.end()
  }
}
