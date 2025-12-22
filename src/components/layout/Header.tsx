'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-soft' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/logo/FlowCobaltLogo.png`}
              alt="FlowCobalt Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="text-xl md:text-2xl font-bold text-text-primary">
              FlowCobalt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              Services
            </Link>
            <Link
              href="/case-studies"
              className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              Case Studies
            </Link>
            <Link
              href="/process"
              className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              Process
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="text-sm font-medium text-text-secondary hover:text-brand-purple transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-text-primary hover:text-brand-purple transition-colors"
            >
              Request Demo
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2 text-sm font-semibold text-white gradient-brand rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/case-studies"
                className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                href="/process"
                className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Process
              </Link>
              <Link
                href="/about"
                className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium text-text-primary hover:text-brand-purple transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/contact"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-text-primary border border-gray-300 rounded-lg hover:border-brand-purple transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Request Demo
                </Link>
                <Link
                  href="/contact"
                  className="block w-full px-4 py-2 text-center text-sm font-semibold text-white gradient-brand rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

