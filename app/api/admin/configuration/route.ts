import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const configPath = path.join(process.cwd(), 'config.json')

export async function GET() {
  try {
    const config = await fs.readFile(configPath, 'utf-8')
    return NextResponse.json(JSON.parse(config))
  } catch (error) {
    console.error('Error reading configuration:', error)
    // If file doesn't exist, return default configuration
    return NextResponse.json({ page2: ['aboutMe'], page3: ['address'] })
  }
}

export async function POST(request: Request) {
  console.log('POST request received')
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    if (!body.page2 || !body.page3 || body.page2.length === 0 || body.page3.length === 0) {
      return NextResponse.json({ error: 'Invalid configuration' }, { status: 400 })
    }

    await fs.writeFile(configPath, JSON.stringify(body, null, 2))
    console.log('Configuration saved successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving configuration:', error)
    // Return a more detailed error message
    return NextResponse.json({ 
      error: 'Failed to save configuration', 
      details: error.message 
    }, { status: 500 })
  }
}
