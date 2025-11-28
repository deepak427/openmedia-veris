'use client'

import { useState } from 'react'
import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark, AlertCircle, CheckCircle, XCircle, HelpCircle } from 'lucide-react'

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

export default function ClaimCard({ claim }: { claim: Claim }) {
  const [imageError, setImageError] = useState<Set<number>>(new Set())
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Verified' }
      case 'false': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'False' }
      case 'disputed': return { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Disputed' }
      default: return { icon: HelpCircle, color: 'text-gray-500', bg: 'bg-gray-50', label: 'Unverified' }
    }
  }

  const statusConfig = getStatusConfig(claim.verification_status)
  const StatusIcon = statusConfig.icon

  const hasMedia = (claim.images && claim.images.length > 0) || (claim.videos && claim.videos.length > 0)

  return (
    <article className="bg-white border border-neutral-200 rounded-xl mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              <img
                src={`https://ui-avatars.com/api/?name=${claim.source}&background=random`}
                alt={claim.source}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-neutral-900">{claim.source}</span>
              <span className="text-neutral-400 text-xs">• {new Date(claim.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-neutral-500">{claim.category}</p>
          </div>
        </div>
        <button className="text-neutral-600 hover:text-neutral-900">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media */}
      {hasMedia ? (
        <div className="w-full bg-neutral-100 aspect-square sm:aspect-video relative overflow-hidden">
          {claim.images && claim.images.length > 0 && (
            <img
              src={claim.images[0]}
              alt="Claim evidence"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          {claim.videos && claim.videos.length > 0 && (
            <video
              src={claim.videos[0]}
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ) : (
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center min-h-[200px]">
          <h3 className="text-xl font-medium text-center text-neutral-800 px-4">
            "{claim.claim}"
          </h3>
        </div>
      )}

      {/* Verification Bar */}
      <div className={`px-4 py-2 flex items-center justify-between ${statusConfig.bg} border-y border-neutral-100`}>
        <div className="flex items-center gap-2">
          <StatusIcon size={18} className={statusConfig.color} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
        </div>
        <span className="text-xs font-medium text-neutral-500">{claim.confidence}% Confidence</span>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button className="text-neutral-900 hover:text-neutral-600 transition-colors">
              <Heart size={24} />
            </button>
            <button className="text-neutral-900 hover:text-neutral-600 transition-colors">
              <MessageCircle size={24} />
            </button>
            <button className="text-neutral-900 hover:text-neutral-600 transition-colors">
              <Send size={24} />
            </button>
          </div>
          <button className="text-neutral-900 hover:text-neutral-600 transition-colors">
            <Bookmark size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-900">
            <span className="font-semibold mr-2">{claim.source}</span>
            {hasMedia && claim.claim}
          </p>

          <div className="text-sm text-neutral-600">
            <p className={`${!isExpanded && 'line-clamp-2'}`}>
              {claim.evidence}
            </p>
            {claim.evidence.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neutral-400 text-xs mt-1 hover:text-neutral-600"
              >
                {isExpanded ? 'less' : 'more'}
              </button>
            )}
          </div>

          {claim.sources && claim.sources.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-neutral-500 mb-1">Sources verified:</p>
              <div className="flex flex-wrap gap-2">
                {claim.sources.slice(0, 2).map((source, i) => (
                  <a
                    key={i}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate max-w-[200px]"
                  >
                    {new URL(source).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
