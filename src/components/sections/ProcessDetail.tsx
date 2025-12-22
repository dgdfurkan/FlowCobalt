'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We understand your process',
    details: [
      'Initial consultation to understand your workflow',
      'Process mapping and documentation',
      'Identify pain points and automation opportunities',
      'Define success metrics and ROI expectations',
    ],
  },
  {
    number: '02',
    title: 'Build',
    description: 'We develop the automation',
    details: [
      'Design automation architecture',
      'Develop workflow using n8n or custom solution',
      'Implement error handling and monitoring',
      'Test thoroughly in staging environment',
    ],
  },
  {
    number: '03',
    title: 'Deploy',
    description: 'We deploy to production',
    details: [
      'Deploy automation to production environment',
      'Monitor initial runs for any issues',
      'Provide team training and documentation',
      'Hand over access and credentials',
    ],
  },
  {
    number: '04',
    title: 'Support',
    description: 'We provide ongoing support',
    details: [
      'Monitor automation performance',
      'Address any issues or errors',
      'Optimize workflows based on feedback',
      'Plan future improvements and enhancements',
    ],
  },
]

export default function ProcessDetail() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const ctx = gsap.context(() => {
      if (stepsRef.current && sectionRef.current) {
        const steps = stepsRef.current.children
        
        gsap.from(steps, {
          opacity: 0,
          x: -30,
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
        <div className="max-w-4xl mx-auto">
          <div ref={stepsRef} className="space-y-12">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-brand text-white text-3xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-text-secondary mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <span className="text-brand-purple font-bold mr-3 mt-1">•</span>
                        <span className="text-text-secondary">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

