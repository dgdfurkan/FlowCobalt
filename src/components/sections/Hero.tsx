'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '@/components/ui/Button'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in animation
      gsap.from([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
          >
            Manual ops work →{' '}
            <span className="text-gradient-brand">automated workflows</span>{' '}
            in days, not months.
          </h1>
          
          <p ref={subtitleRef} className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            We build practical AI + n8n automations that reduce errors and free up your team&apos;s time.
          </p>
          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button href="/contact" variant="primary" size="lg">
              Get a 7-day Automation Audit
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Request a demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

