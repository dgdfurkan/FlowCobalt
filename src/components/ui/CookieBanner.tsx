'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from './Button'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    if (typeof window === 'undefined') return

    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShowBanner(false)
    // Trigger Yandex Metrica initialization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookieConsentAccepted'))
    }
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="container-custom max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                We use cookies
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We use cookies and analytics tools to improve your experience on our website. 
                By clicking "Accept", you consent to our use of cookies and analytics. 
                You can learn more in our{' '}
                <Link
                  href="/privacy"
                  className="text-brand-purple hover:text-brand-purple-light underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:ml-6">
              <Button
                variant="secondary"
                size="md"
                onClick={handleReject}
                className="whitespace-nowrap"
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAccept}
                className="whitespace-nowrap"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

