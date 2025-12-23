'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedCustomerStories } from '@/data/customer-stories'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Show first 3 customer stories on homepage
const featuredCustomerStories = getFeaturedCustomerStories(3)

export default function CustomerStories() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.children
        
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full text-sm font-medium text-text-secondary">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Customers
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Building their <span className="text-gradient-brand">AI Workforce</span>
          </h2>
        </div>
        
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {featuredCustomerStories.map((story) => (
            <Link
              key={story.id}
              href={`/customers/${story.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Image Wrapper */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* Cover Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20">
                  <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/50 transition-colors duration-300" />
                </div>
                
                {/* Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                  <div className="relative w-32 h-16 opacity-90 group-hover:opacity-100 transition-opacity">
                    {/* Logo placeholder - gerçek logo eklendiğinde buraya Image component gelecek */}
                    <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{story.company}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-brand-purple transition-colors">
                  {story.title}
                </h3>
                <div className="flex items-center text-brand-purple font-medium text-sm group-hover:text-brand-purple-light transition-colors">
                  <span>Read story</span>
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-purple-light font-semibold transition-colors"
          >
            <span>Customer Stories</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

