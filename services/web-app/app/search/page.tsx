'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import ClaimCard from '@/components/ClaimCard'

interface Claim {
  id: string
  claim: string
  verification_status: string
  confidence: number
  evidence: string
  sources: string[]
  category: string
  source: string
  created_at: string
  images?: string[]
  videos?: string[]
  content_type?: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Claim[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams({ search: searchQuery })
      const res = await fetch(`/api/claims?${params.toString()}`)
      const data = await res.json()
      setResults(data.claims || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="border-b border-neutral-200 px-4 py-6 sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Search
        </h1>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims, sources, or topics..."
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
            <p className="text-neutral-600">No results found for "{searchQuery}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 px-2">{results.length} results found</p>
            {results.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}

        {!searched && (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
            <Search className="mx-auto mb-4 text-neutral-400" size={48} />
            <p className="text-neutral-600">Enter a search query to find claims</p>
          </div>
        )}
      </div>
    </div>
  )
}
