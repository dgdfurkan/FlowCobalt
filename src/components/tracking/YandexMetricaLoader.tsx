'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initYandexMetrica, setupCookieConsentListener, trackPageView } from '@/lib/yandex-metrica'

export default function YandexMetricaLoader() {
  const pathname = usePathname()

  useEffect(() => {
    // Setup cookie consent listener
    setupCookieConsentListener()

    // Initialize Yandex Metrica if consent already given
    initYandexMetrica()
  }, [])

  useEffect(() => {
    // Track page view on route change
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  return null
}

