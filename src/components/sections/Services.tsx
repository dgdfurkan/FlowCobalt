'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Services() {
  const t = useTranslations('services')
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const services = [
    {
      id: 'audit',
      title: t('service1Title'),
      description: t('service1Description'),
      features: [t('service1Feature1'), t('service1Feature2'), t('service1Feature3'), t('service1Feature4')],
      duration: t('service1Duration'),
      price: t('service1Price'),
    },
    {
      id: 'sprint',
      title: t('service2Title'),
      description: t('service2Description'),
      features: [t('service2Feature1'), t('service2Feature2'), t('service2Feature3'), t('service2Feature4')],
      duration: t('service2Duration'),
      price: t('service2Price'),
    },
    {
      id: 'retainer',
      title: t('service3Title'),
      description: t('service3Description'),
      features: [t('service3Feature1'), t('service3Feature2'), t('service3Feature3'), t('service3Feature4')],
      duration: t('service3Duration'),
      price: t('service3Price'),
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.children
        gsap.from(cards, {
          opacity: 0, y: 50, duration: 0.8, stagger: 0.2,
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
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <Card key={service.id} hover={true}>
              <CardHeader>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-brand-purple font-semibold text-lg mb-2">{service.price}</p>
                <p className="text-sm text-text-secondary">{service.duration}</p>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{service.description}</CardDescription>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-brand-purple font-bold mr-2">✓</span>
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button href="/contact" variant="primary" size="md" className="w-full">
                  {t('getStarted')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
