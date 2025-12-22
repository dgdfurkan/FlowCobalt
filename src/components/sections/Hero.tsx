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
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative lines background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Line behind title - responsive positioning */}
        <svg
          className="absolute left-0 w-full opacity-[0.15]"
          style={{
            top: 'clamp(15%, 20%, 25%)',
            height: 'clamp(300px, 50vh, 600px)',
          }}
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#6b7280" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Main wavy line */}
          <path
            d="M-200,200 Q200,120 500,200 T1100,200 T1600,200"
            stroke="url(#lineGradient1)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="hidden md:block"
          />
          {/* Secondary subtle line */}
          <path
            d="M-150,180 Q250,100 550,180 T1050,180 T1550,180"
            stroke="#d1d5db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeOpacity="0.4"
            className="hidden lg:block"
          />
        </svg>
        
        {/* Line behind buttons - responsive positioning */}
        <svg
          className="absolute left-0 w-full opacity-[0.15]"
          style={{
            top: 'clamp(60%, 70%, 75%)',
            height: 'clamp(200px, 30vh, 400px)',
          }}
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#6b7280" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Main curved line */}
          <path
            d="M-200,200 Q300,150 700,200 T1400,200"
            stroke="url(#lineGradient2)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="hidden sm:block"
          />
          {/* Secondary subtle line */}
          <path
            d="M-150,180 Q350,130 750,180 T1350,180"
            stroke="#d1d5db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeOpacity="0.4"
            className="hidden md:block"
          />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 relative z-10"
            >
              Manual ops work →{' '}
              <span className="text-gradient-brand">automated workflows</span>{' '}
              in days, not months.
            </h1>
          </div>
          
          <p ref={subtitleRef} className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto relative z-10">
            We build practical AI + n8n automations that reduce errors and free up your team&apos;s time.
          </p>
          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
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

