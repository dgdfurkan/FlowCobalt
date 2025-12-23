'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { customerStories } from '@/data/customer-stories'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CustomerStoriesList() {
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
          stagger: 0.15,
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
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {customerStories.map((story) => (
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
                    {/* Logo placeholder */}
                    <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{story.company}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-purple transition-colors">
                  {story.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {story.excerpt}
                </p>
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
      </div>
    </section>
  )
}

