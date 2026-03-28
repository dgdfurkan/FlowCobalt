'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Button from './Button'

export default function CookieBanner() {
  const t = useTranslations('cookieBanner')
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setShowBanner(false)
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
              <h3 className="text-lg font-semibold text-text-primary mb-2">{t('title')}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t('description')}{' '}
                <Link href="/privacy" className="text-brand-purple hover:text-brand-purple-light underline">
                  {t('privacyPolicy')}
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:ml-6">
              <Button variant="secondary" size="md" onClick={handleReject} className="whitespace-nowrap">
                {t('reject')}
              </Button>
              <Button variant="primary" size="md" onClick={handleAccept} className="whitespace-nowrap">
                {t('accept')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
