'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const values = [
  {
    title: 'Speed',
    description: 'We deliver automation solutions in days, not months. Fast iteration and quick wins.',
  },
  {
    title: 'Simplicity',
    description: 'Complex problems deserve simple solutions. We build automations that are easy to understand and maintain.',
  },
  {
    title: 'Reliability',
    description: 'Your workflows run 24/7 without errors. We build robust systems with proper error handling and monitoring.',
  },
  {
    title: 'Transparency',
    description: 'Clear communication, detailed documentation, and no surprises. You always know what\'s happening.',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (itemsRef.current) {
        const items = itemsRef.current.children
        
        gsap.from(items, {
          opacity: 0,
          y: 30,
          duration: 0.6,
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
    <>
      {/* Mission/Vision Section */}
      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                We believe that manual, repetitive work should be automated. Our mission is to help teams 
                eliminate time-consuming tasks, reduce errors, and focus on what matters most—building great 
                products and serving customers.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                We envision a world where every team has access to powerful automation tools that are easy 
                to use, reliable, and affordable. No more spending months on complex implementations—just 
                practical solutions that work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={sectionRef} className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12 text-center">
              Our Values
            </h2>
            <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

