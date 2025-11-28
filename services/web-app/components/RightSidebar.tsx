'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TrendingClaim {
  id: string
  claim: string
  verification_status: string
  category: string
}

export default function RightSidebar() {
  const [trending, setTrending] = useState<TrendingClaim[]>([])

  useEffect(() => {
    fetchTrending()
  }, [])

  async function fetchTrending() {
    try {
      const res = await fetch('/api/claims')
      const data = await res.json()
      if (data.success && data.claims) {
        setTrending(data.claims.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch trending:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return '✓'
      case 'false': return '✗'
      case 'disputed': return '⚠'
      default: return '?'
    }
  }

  return (
    <aside className="hidden lg:block w-[320px] pl-8 py-8 fixed right-0 h-screen overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-500 text-sm">Recent Claims</h3>
        </div>

        <div className="space-y-4">
          {trending.length > 0 ? (
            trending.map((claim) => (
              <div key={claim.id} className="flex items-start gap-3 hover:bg-neutral-50 p-2 rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center text-sm">
                  {getStatusIcon(claim.verification_status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                    {claim.claim}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 capitalize">
                    {claim.category || 'general'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500">No claims yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-neutral-400">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </nav>
        <p>© 2025 Veris from Mumbai Hacks</p>
      </div>
    </aside>
  )
}
