'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProcessDetail() {
  const t = useTranslations('process')
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      number: t('step1Number'), title: t('step1Title'), description: t('step1Description'),
      details: [t('step1Detail1'), t('step1Detail2'), t('step1Detail3'), t('step1Detail4')],
    },
    {
      number: t('step2Number'), title: t('step2Title'), description: t('step2Description'),
      details: [t('step2Detail1'), t('step2Detail2'), t('step2Detail3'), t('step2Detail4')],
    },
    {
      number: t('step3Number'), title: t('step3Title'), description: t('step3Description'),
      details: [t('step3Detail1'), t('step3Detail2'), t('step3Detail3'), t('step3Detail4')],
    },
    {
      number: t('step4Number'), title: t('step4Title'), description: t('step4Description'),
      details: [t('step4Detail1'), t('step4Detail2'), t('step4Detail3'), t('step4Detail4')],
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      if (stepsRef.current && sectionRef.current) {
        const steps = stepsRef.current.children
        gsap.from(steps, {
          opacity: 0, x: -30, duration: 0.8, stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%', end: 'bottom 20%',
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
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-brand text-white text-3xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-lg text-text-secondary mb-4">{step.description}</p>
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
