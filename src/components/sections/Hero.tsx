'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('hero')

  useEffect(() => {
    const ctx = gsap.context(() => {
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
          <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            {t('titleStart')}{' '}
            <span className="text-gradient-brand">{t('titleHighlight')}</span>{' '}
            {t('titleEnd')}
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button href="/contact" variant="primary" size="lg">{t('cta1')}</Button>
            <Button href="/contact" variant="secondary" size="lg">{t('cta2')}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
