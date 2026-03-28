'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/case-studies', label: t('caseStudies') },
    { href: '/process', label: t('process') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container-custom pt-4">
        <nav
          className={`rounded-2xl transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-medium' : 'bg-white/95 backdrop-blur-md shadow-soft'
          } md:border-0 md:ring-0 border border-gray-800/20 ring-1 ring-gray-800/10 shadow-lg`}
        >
          <div className="container-custom px-6 md:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/logo/logo3.png"
                  alt="FlowCobalt Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <span className="text-xl md:text-2xl font-bold text-text-primary">FlowCobalt</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Desktop: CTA + Language Switcher */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => switchLocale('en')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                      locale === 'en'
                        ? 'bg-white text-brand-purple shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Switch to English"
                  >
                    EN
                  </button>
                  <button
                    onClick={() => switchLocale('tr')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                      locale === 'tr'
                        ? 'bg-white text-brand-purple shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Türkçeye geç"
                  >
                    TR
                  </button>
                </div>

                <Link
                  href="/contact"
                  className="px-4 py-2 text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
                >
                  {t('requestDemo')}
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-2 text-sm font-semibold text-white gradient-brand rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('getStarted')}
                </Link>
              </div>

              {/* Mobile: Language + Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => switchLocale('en')}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                      locale === 'en' ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => switchLocale('tr')}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                      locale === 'tr' ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    TR
                  </button>
                </div>
                <button
                  className="p-2 text-text-primary"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={t('toggleMenu')}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200 mx-4 mb-4 rounded-xl border border-gray-800/20 bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col space-y-4 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      href="/contact"
                      className="block w-full px-4 py-2 text-center text-sm font-medium text-text-primary border border-gray-300 rounded-lg hover:border-brand-purple transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('requestDemo')}
                    </Link>
                    <Link
                      href="/contact"
                      className="block w-full px-4 py-2 text-center text-sm font-semibold text-white gradient-brand rounded-lg hover:opacity-90 transition-opacity"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('getStarted')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
