'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTrackingService } from '@/lib/tracking'

export default function ScrollTracker() {
  const pathname = usePathname()
  const tracking = getTrackingService()

  useEffect(() => {
    // Update page path when route changes
    if (pathname) {
      tracking.updatePagePath(pathname)
    }

    // Cleanup on unmount
    return () => {
      tracking.cleanup()
    }
  }, [pathname, tracking])

  return null
}

