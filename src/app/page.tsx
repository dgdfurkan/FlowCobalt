'use client'

import { useEffect } from 'react'
import Hero from '@/components/sections/Hero'
import TrustBlocks from '@/components/sections/TrustBlocks'
import Products from '@/components/sections/Products'
import CaseStudies from '@/components/sections/CaseStudies'
import Process from '@/components/sections/Process'
import { useTracking } from '@/lib/tracking'

export default function Home() {
  const tracking = useTracking()

  useEffect(() => {
    // Track page view (only in browser, not during build)
    if (typeof window !== 'undefined') {
      tracking.trackPageView('/')
    }
  }, [tracking])

  return (
    <>
      <Hero />
      <TrustBlocks />
      <Products />
      <CaseStudies />
      <Process />
    </>
  )
}

