'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { caseStudies } from '@/data/case-studies'
import { getFeaturedCustomerStories } from '@/data/customer-stories'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Show first 3 case studies and 3 customer stories on homepage
const featuredCaseStudies = caseStudies.slice(0, 3)
const featuredCustomerStories = getFeaturedCustomerStories(3)

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.children
        
        // Set initial state
        gsap.set(cards, { opacity: 0, y: 50 })
        
        gsap.to(cards, {
          opacity: 1,
          y: 0,
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            See how we&apos;ve helped teams automate their workflows
          </p>
        </div>
        
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 min-h-[400px]">
          {/* Case Studies */}
          {featuredCaseStudies.map((study) => (
            <Card key={study.id} href={`/case-studies/${study.slug}`}>
              <CardHeader>
                <CardTitle>{study.title}</CardTitle>
                {study.industry && (
                  <p className="text-sm text-text-secondary mt-2">{study.industry}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-brand-purple font-semibold text-xl mb-3">
                  {study.result}
                </p>
                <CardDescription className="mb-4">
                  {study.excerpt}
                </CardDescription>
                <CardDescription className="text-brand-purple font-medium">
                  Learn more →
                </CardDescription>
              </CardContent>
            </Card>
          ))}
          
          {/* Customer Stories (Videos) */}
          {featuredCustomerStories.map((story) => (
            <Link
              key={story.id}
              href={`/customers/${story.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Image Wrapper */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* Cover Image */}
                {story.coverImage && (
                  <div className="absolute inset-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${story.coverImage}`}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gray-900/50 group-hover:bg-gray-900/60 transition-colors duration-300" />
                  </div>
                )}
                {!story.coverImage && (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20">
                    <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/50 transition-colors duration-300" />
                  </div>
                )}
                
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
        
        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-brand-purple hover:text-brand-purple-light font-semibold transition-colors"
          >
            View all case studies →
          </Link>
          <span className="text-text-secondary hidden sm:inline">•</span>
          <Link
            href="/customers"
            className="inline-flex items-center text-brand-purple hover:text-brand-purple-light font-semibold transition-colors"
          >
            View customer stories →
          </Link>
        </div>
      </div>
    </section>
  )
}

