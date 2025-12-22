'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Placeholder data - will be replaced with real case studies
const caseStudies = [
  {
    title: 'Case Study 1',
    result: '50% time saved',
    href: '/case-studies/1',
  },
  {
    title: 'Case Study 2',
    result: '90% error reduction',
    href: '/case-studies/2',
  },
  {
    title: 'Case Study 3',
    result: '2 weeks delivery',
    href: '/case-studies/3',
  },
]

export default function CaseStudies() {
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
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            See how we've helped teams automate their workflows
          </p>
        </div>
        
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {caseStudies.map((study, index) => (
            <Card key={index} href={study.href}>
              <CardHeader>
                <CardTitle>{study.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-purple font-semibold text-xl">
                  {study.result}
                </p>
                <CardDescription className="mt-4">
                  Learn more →
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

