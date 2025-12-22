'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    id: 'audit',
    title: 'Automation Audit',
    description: 'Comprehensive analysis of your current workflows to identify automation opportunities.',
    features: [
      'Process mapping and analysis',
      'Automation opportunity identification',
      'ROI estimation',
      'Implementation roadmap',
    ],
    duration: '1 week',
    price: 'Starting at $2,500',
  },
  {
    id: 'sprint',
    title: '1 Sprint Automation',
    description: 'Complete automation solution delivered in 1-2 weeks. Fast, focused, and results-driven.',
    features: [
      'End-to-end workflow automation',
      'n8n or custom solution',
      'Full documentation',
      'Team training included',
    ],
    duration: '1-2 weeks',
    price: 'Starting at $5,000',
  },
  {
    id: 'retainer',
    title: 'Ops Retainer',
    description: 'Ongoing support and continuous automation improvements for your operations team.',
    features: [
      'Monthly automation improvements',
      'Priority support',
      'Performance monitoring',
      'Quarterly strategy reviews',
    ],
    duration: 'Ongoing',
    price: 'Starting at $3,000/month',
  },
]

export default function Services() {
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
    <section ref={sectionRef} className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <Card key={service.id} hover={true}>
              <CardHeader>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-brand-purple font-semibold text-lg mb-2">
                  {service.price}
                </p>
                <p className="text-sm text-text-secondary">{service.duration}</p>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {service.description}
                </CardDescription>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-brand-purple font-bold mr-2">✓</span>
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button href="/contact" variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

