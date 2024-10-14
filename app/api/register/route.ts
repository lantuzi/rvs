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
  console.log('POST request received')
  
  try {
    const body = await request.json()
    console.log('Request body:', body)

    const {
      email,
      password,
      birthdate,
      aboutMe,
      streetAddress,
      city,
      state,
      zip
    } = body

    const pool = new Pool(dbConfig)

    try {
      const client = await pool.connect()
      try {
        await client.query('BEGIN')

        // Prepare dynamic query parts
        const columns = ['email', 'password']
        const values = [email, password]
        const placeholders = ['$1', '$2']
        let index = 3

        if (birthdate) {
          columns.push('birthdate')
          values.push(birthdate)
          placeholders.push(`$${index}`)
          index++
        }

        if (aboutMe) {
          columns.push('about_me')
          values.push(aboutMe)
          placeholders.push(`$${index}`)
          index++
        }

        if (streetAddress) {
          columns.push('street_address')
          values.push(streetAddress)
          placeholders.push(`$${index}`)
          index++
        }

        if (city) {
          columns.push('city')
          values.push(city)
          placeholders.push(`$${index}`)
          index++
        }

        if (state) {
          columns.push('state')
          values.push(state)
          placeholders.push(`$${index}`)
          index++
        }

        if (zip) {
          columns.push('zip')
          values.push(zip)
          placeholders.push(`$${index}`)
          index++
        }

        const insertQuery = `
          INSERT INTO users (${columns.join(', ')})
          VALUES (${placeholders.join(', ')})
        `

        await client.query(insertQuery, values)
        await client.query('COMMIT')
        console.log('User registered successfully')
        return NextResponse.json({ success: true })
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
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
