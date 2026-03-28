'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const t = useTranslations('about')
  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  const values = [
    { title: t('value1Title'), description: t('value1Description') },
    { title: t('value2Title'), description: t('value2Description') },
    { title: t('value3Title'), description: t('value3Description') },
    { title: t('value4Title'), description: t('value4Description') },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (itemsRef.current) {
        const items = itemsRef.current.children
        gsap.from(items, {
          opacity: 0, y: 30, duration: 0.6, stagger: 0.15,
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
    <>
      {/* Mission/Vision Section */}
      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('missionTitle')}</h2>
              <p className="text-lg text-text-secondary leading-relaxed">{t('missionText')}</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('visionTitle')}</h2>
              <p className="text-lg text-text-secondary leading-relaxed">{t('visionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={sectionRef} className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12 text-center">{t('valuesTitle')}</h2>
            <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-3">{value.title}</h3>
                  <p className="text-text-secondary">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
