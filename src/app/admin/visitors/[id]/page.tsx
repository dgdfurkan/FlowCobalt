'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import VisitorDetailClient from './VisitorDetailClient'

// This is a client-only page for dynamic routing
export default function VisitorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const visitorId = params?.id as string

  if (!visitorId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return <VisitorDetailClient visitorId={visitorId} />
}
