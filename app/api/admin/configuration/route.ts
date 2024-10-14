import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: 'postgresql://postgres.kiihenmwpjtvgbktvvul:Lantuzi@2024@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT config_value FROM configurations WHERE config_key = $1', ['app_config'])
    client.release()

    if (result.rows.length > 0) {
      return NextResponse.json(result.rows[0].config_value)
    } else {
      return NextResponse.json({ page2: ['aboutMe'], page3: ['address'] })
    }
  } catch (error) {
    console.error('Error reading configuration:', error)
    return NextResponse.json({ page2: ['aboutMe'], page3: ['address'] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = await pool.connect()
    await client.query(
      'INSERT INTO configurations (config_key, config_value) VALUES ($1, $2) ON CONFLICT (config_key) DO UPDATE SET config_value = $2',
      ['app_config', body]
    )
    client.release()
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error saving configuration:', error)
    return NextResponse.json({ 
      error: 'Failed to save configuration', 
      details: (error as Error).message || 'An unknown error occurred'
    }, { status: 500 })
  }
}
