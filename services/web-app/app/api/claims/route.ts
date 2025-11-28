import { NextResponse } from 'next/server'
import { queryClaims } from '@/lib/db'

export async function GET() {
  try {
    const claims = await queryClaims()
    
    return NextResponse.json({
      success: true,
      claims
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      claims: [],
      error: 'Failed to fetch claims'
    }, { status: 500 })
  }
}
