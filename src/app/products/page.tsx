'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import ProductsList from '@/components/sections/ProductsList'
import { useTracking } from '@/lib/tracking'
import { getFeaturedProducts } from '@/data/products'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProductsPage() {
  const tracking = useTracking()
  const heroRef = useRef<HTMLElement>(null)
  const featureSection1Ref = useRef<HTMLElement>(null)
  const featureSection2Ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      tracking.trackPageView('/products')
    }
  }, [tracking])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        const heroContent = heroRef.current.querySelector('.hero-content')
        const heroCard = heroRef.current.querySelector('.hero-card')
        
        if (heroContent) {
          gsap.from(heroContent.children, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
          })
        }
        
        if (heroCard) {
          gsap.from(heroCard, {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out',
          })
        }
      }

      // Feature sections animation
      if (featureSection1Ref.current) {
        gsap.from(featureSection1Ref.current.querySelectorAll('.feature-card'), {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: featureSection1Ref.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      if (featureSection2Ref.current) {
        gsap.from(featureSection2Ref.current.querySelectorAll('.feature-card'), {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: featureSection2Ref.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const featuredProduct = getFeaturedProducts(1)[0]

  return (
    <>
      {/* Dark Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container-custom relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="hero-content">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/20 border border-brand-purple/30 rounded-full text-sm font-medium text-brand-purple">
                  <span className="w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
                  Our Products
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Build powerful solutions in{' '}
                <span className="text-brand-purple">seconds</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Discover our innovative products designed to transform your workflow. 
                From AI-powered e-commerce platforms to enterprise dealer management systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#products"
                  className="px-6 py-3 bg-brand-purple text-white rounded-lg font-semibold hover:bg-brand-purple-light transition-colors"
                >
                  Explore Products
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  Request Demo
                </Link>
              </div>
            </div>

            {/* Right Column - Featured Product Card */}
            {featuredProduct && (
              <div className="hero-card">
                <Link
                  href={`/products/${featuredProduct.slug}`}
                  className="group relative block bg-white rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-xs font-medium">
                      {featuredProduct.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-purple transition-colors">
                    {featuredProduct.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredProduct.excerpt}
                  </p>
                  <div className="flex items-center text-brand-purple font-semibold">
                    <span>Learn more</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What are our Products Section */}
      <section 
        ref={featureSection1Ref}
        className="section-padding bg-background"
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What are our <span className="text-brand-purple">Products</span>?
            </h2>
            <p className="text-lg text-text-secondary">
              We build innovative solutions that solve real-world problems. 
              From AI-powered platforms to enterprise management systems, our products are designed to transform how you work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-brand-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                AI-Powered Solutions
              </h3>
              <p className="text-text-secondary">
                Leverage artificial intelligence to automate workflows, analyze data, and make smarter decisions.
              </p>
            </div>

            <div className="feature-card bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-brand-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Enterprise Ready
              </h3>
              <p className="text-text-secondary">
                Built to scale with enterprise-grade infrastructure, security, and reliability for mission-critical operations.
              </p>
            </div>

            <div className="feature-card bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-brand-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Lightning Fast
              </h3>
              <p className="text-text-secondary">
                Optimized for performance with sub-second response times and seamless user experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* No Coding Required Section */}
      <section 
        ref={featureSection2Ref}
        className="section-padding bg-background-secondary"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                No coding required
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                Easily integrate our solutions into your existing workflow. 
                Our products are designed with simplicity in mind, requiring minimal setup and technical expertise.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-brand-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      Quick Setup
                    </h4>
                    <p className="text-text-secondary">
                      Get started in minutes with our intuitive setup process
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-brand-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      User-Friendly Interface
                    </h4>
                    <p className="text-text-secondary">
                      Designed for users of all technical levels
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-brand-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      Comprehensive Documentation
                    </h4>
                    <p className="text-text-secondary">
                      Step-by-step guides and tutorials to help you succeed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-card bg-white rounded-2xl p-8 shadow-soft">
              <div className="aspect-video bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-brand-purple/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products List Section */}
      <section id="products" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Our <span className="text-brand-purple">Products</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Explore our complete range of innovative solutions designed to transform your workflow
            </p>
          </div>
        </div>
        <ProductsList />
      </section>
    </>
  )
}
