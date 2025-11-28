import { NextResponse } from 'next/server'

interface ADKMessagePart {
  text?: string
  inline_data?: {
    mime_type: string
    data: string
  }
}

/**
 * ADK Agent Client for submitting user content
 * Handles text, images, and videos with proper session management
 */
class ADKSubmissionClient {
  private agentUrl: string
  private userId: string = 'web_user'

  constructor() {
    this.agentUrl = process.env.NEXT_PUBLIC_ADK_AGENT_URL || ''
  }

  async createSession(): Promise<string> {
    const response = await fetch(
      `${this.agentUrl}/apps/veris_agent/users/${this.userId}/sessions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.status}`)
    }
    
    const data = await response.json()
    return data.id
  }

  async submitToAgent(parts: ADKMessagePart[]): Promise<boolean> {
    try {
      // Create fresh session for each submission
      const sessionId = await this.createSession()

      const response = await fetch(`${this.agentUrl}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          app_name: 'veris_agent',
          user_id: this.userId,
          session_id: sessionId,
          newMessage: {
            role: 'user',
            parts,
          },
        }),
      })

      // Accept 200 or 202 as success
      return response.ok || response.status === 202
    } catch (error) {
      console.error('ADK submission error:', error)
      return false
    }
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const text = formData.get('text') as string
    const file = formData.get('file') as File | null

    // Validation: Must have text OR file (not both, not neither)
    if (!text && !file) {
      return NextResponse.json({
        success: false,
        message: 'Please provide text or upload a file'
      }, { status: 400 })
    }

    if (text && text.trim().length < 10) {
      return NextResponse.json({
        success: false,
        message: 'Please provide at least 10 characters'
      }, { status: 400 })
    }

    // Validate file type
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({
          success: false,
          message: 'Invalid file type. Please upload JPG, PNG, WebP images or MP4, WebM videos.'
        }, { status: 400 })
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        }, { status: 400 })
      }
    }

    const adkClient = new ADKSubmissionClient()
    const parts: ADKMessagePart[] = []

    if (file) {
      // Convert file to base64 for inline_data
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      parts.push({
        inline_data: {
          mime_type: file.type,
          data: base64,
        }
      })

      // Add optional text context
      if (text && text.trim()) {
        parts.push({
          text: `Additional context: ${text.trim()}`
        })
      }
    } else {
      // Text-only submission
      parts.push({
        text: `User submitted text for fact-checking:\n\n${text.trim()}`
      })
    }

    const success = await adkClient.submitToAgent(parts)

    if (success) {
      return NextResponse.json({
        success: true,
        status: 'submitted',
        message: 'Your submission has been sent for AI verification. Check the feed in 2-3 minutes to see the results!'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to submit to AI agent. Please try again.'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to submit. Please try again.'
    }, { status: 500 })
  }
}
