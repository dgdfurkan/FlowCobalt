'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useTracking } from '@/lib/tracking'
import { Product } from '@/data/products'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Cloudinary Video Player Component
function CloudinaryVideoPlayer({ 
  videoUrl, 
  className = '' 
}: { 
  videoUrl: string | string[]
  className?: string 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<string[]>([])
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)

  useEffect(() => {
    if (!videoUrl) {
      setVideos([])
      return
    }
    const videoArray = Array.isArray(videoUrl) ? videoUrl : [videoUrl]
    setVideos(videoArray.filter(Boolean))
  }, [videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || videos.length === 0) return

    const currentVideo = videos[currentVideoIndex]
    if (!currentVideo || typeof currentVideo !== 'string') return

    try {
      video.src = currentVideo
      video.load()

      const handleLoadedMetadata = () => {
        try {
          if (video.videoWidth && video.videoHeight && video.videoWidth > 0 && video.videoHeight > 0) {
            const ratio = video.videoWidth / video.videoHeight
            if (ratio > 0 && isFinite(ratio)) {
              setAspectRatio(ratio)
            }
          }
          video.play().catch(err => {
            console.warn('Autoplay prevented:', err)
          })
        } catch (error) {
          console.error('Error handling video metadata:', error)
        }
      }

      const handleError = () => {
        console.error('Video loading error:', currentVideo)
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(prev => prev + 1)
        }
      }

      const handleEnded = () => {
        try {
          if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(prev => prev + 1)
          } else {
            setCurrentVideoIndex(0)
          }
        } catch (error) {
          console.error('Error handling video end:', error)
        }
      }

      video.addEventListener('ended', handleEnded)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      video.addEventListener('error', handleError)

      return () => {
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('error', handleError)
      }
    } catch (error) {
      console.error('Error setting up video:', error)
    }
  }, [currentVideoIndex, videos])

  if (videos.length === 0) return null

  return (
    <div 
      ref={containerRef}
      className={`relative w-full flex items-center justify-center ${className}`}
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : '16/9',
        backgroundColor: 'transparent',
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
        loop={videos.length === 1}
        muted
        playsInline
        preload="auto"
        style={{
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// Description Parser - Parse description into structured data
interface ParsedDescription {
  intro: string
  features: Array<{ title: string; description: string }>
  benefits: Array<{ title: string; description: string }>
  specialSections: Array<{ title: string; items: string[] }>
}

function parseDescription(description: string): ParsedDescription {
  const result: ParsedDescription = {
    intro: '',
    features: [],
    benefits: [],
    specialSections: [],
  }

  if (!description || typeof description !== 'string') {
    return result
  }

  try {
    const lines = description.split('\n').filter(line => line.trim())
    let currentSection: string | null = null
    let currentItems: string[] = []
    let introFound = false

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) return

      // Check for section headers (starts with ** and ends with **)
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        // Save previous section
        if (currentSection === 'Features' && currentItems.length > 0) {
          result.features = currentItems.map(item => {
            const cleaned = item.replace(/\*\*/g, '').replace(/^-\s*/, '').trim()
            const parts = cleaned.split(':').map(p => p.trim())
            return {
              title: parts[0] || cleaned,
              description: parts.slice(1).join(':').trim() || parts[0] || cleaned,
            }
          }).filter(f => f.title && f.title.length > 0)
        } else if (currentSection === 'Benefits' && currentItems.length > 0) {
          result.benefits = currentItems.map(item => {
            const cleaned = item.replace(/\*\*/g, '').replace(/^-\s*/, '').trim()
            const parts = cleaned.split(':').map(p => p.trim())
            return {
              title: parts[0] || cleaned,
              description: parts.slice(1).join(':').trim() || parts[0] || cleaned,
            }
          }).filter(b => b.title && b.title.length > 0)
        } else if (currentSection && currentItems.length > 0) {
          result.specialSections.push({
            title: currentSection,
            items: currentItems.map(item => item.replace(/\*\*/g, '').replace(/^-\s*/, '').trim()),
          })
        }

        // Reset for new section
        currentItems = []
        const sectionTitle = trimmed.slice(2, -2).replace(':', '')
        
        if (sectionTitle.includes('Feature')) {
          currentSection = 'Features'
        } else if (sectionTitle.includes('Benefit')) {
          currentSection = 'Benefits'
        } else {
          currentSection = sectionTitle
        }
      }
      // List item (starts with -) or just a line (for features/benefits)
      else if (trimmed.startsWith('- ')) {
        const item = trimmed.slice(2).trim()
        if (item) currentItems.push(item)
      }
      // Feature/Benefit line (no dash, just text)
      else if (currentSection && !trimmed.startsWith('**') && trimmed.length > 0) {
        currentItems.push(trimmed)
      }
      // Regular paragraph - first one is intro
      else if (!introFound && !trimmed.startsWith('**') && !trimmed.startsWith('-')) {
        result.intro = trimmed.replace(/\*\*/g, '').trim()
        introFound = true
      }
    })

    // Save last section
    if (currentSection === 'Features' && currentItems.length > 0) {
      result.features = currentItems.map(item => {
        const cleaned = item.replace(/\*\*/g, '').replace(/^-\s*/, '').trim()
        const parts = cleaned.split(':').map(p => p.trim())
        return {
          title: parts[0] || cleaned,
          description: parts.slice(1).join(':').trim() || parts[0] || cleaned,
        }
      }).filter(f => f.title && f.title.length > 0)
    } else if (currentSection === 'Benefits' && currentItems.length > 0) {
      result.benefits = currentItems.map(item => {
        const cleaned = item.replace(/\*\*/g, '').replace(/^-\s*/, '').trim()
        const parts = cleaned.split(':').map(p => p.trim())
        return {
          title: parts[0] || cleaned,
          description: parts.slice(1).join(':').trim() || parts[0] || cleaned,
        }
      }).filter(b => b.title && b.title.length > 0)
    } else if (currentSection && currentItems.length > 0) {
      result.specialSections.push({
        title: currentSection,
        items: currentItems.map(item => item.replace(/\*\*/g, '').replace(/^-\s*/, '').trim()),
      })
    }
  } catch (error) {
    console.error('Error parsing description:', error)
  }

  return result
}

// Component to format description with proper paragraphs, bold text, and lists
function FormattedDescription({ description }: { description: string }) {
  try {
    if (!description || typeof description !== 'string') {
      return <div className="text-text-secondary">No description available.</div>
    }

    const lines = description.split('\n').filter(line => line.trim())
    const elements: JSX.Element[] = []
    let currentList: string[] = []
    let currentSectionTitle: string | null = null

    const renderList = (items: string[]) => {
      if (items.length === 0) return null
      return (
        <ul key={`list-${elements.length}`} className="list-disc list-inside mb-6 space-y-2 text-text-secondary">
          {items.map((item, idx) => {
            if (!item || typeof item !== 'string') return null
            const cleaned = item.replace(/\*\*/g, '').trim()
            if (!cleaned) return null
            
            // Check if item has colon (title: description format)
            const colonIndex = cleaned.indexOf(':')
            if (colonIndex > 0) {
              const title = cleaned.substring(0, colonIndex).trim()
              const description = cleaned.substring(colonIndex + 1).trim()
              return (
                <li key={idx} className="text-base leading-relaxed">
                  <strong className="font-semibold text-text-primary">{title}:</strong> {description}
                </li>
              )
            }
            
            return (
              <li key={idx} className="text-base leading-relaxed">
                {cleaned}
              </li>
            )
          })}
        </ul>
      )
    }

    lines.forEach((line, idx) => {
      if (!line || typeof line !== 'string') return
      
      const trimmed = line.trim()
      if (!trimmed) return
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':')) {
        if (currentList.length > 0) {
          const listElement = renderList(currentList)
          if (listElement) elements.push(listElement)
          currentList = []
        }
        currentSectionTitle = trimmed.slice(2, -2).trim()
        if (currentSectionTitle) {
          elements.push(
            <h3 key={`title-${idx}`} className="text-2xl font-bold text-text-primary mt-8 mb-4">
              {currentSectionTitle}
            </h3>
          )
        }
      }
      else if (trimmed.startsWith('- ')) {
        const item = trimmed.slice(2).replace(/\*\*/g, '').trim()
        if (item) currentList.push(item)
      }
      else {
        if (currentList.length > 0) {
          const listElement = renderList(currentList)
          if (listElement) elements.push(listElement)
          currentList = []
        }
        
        const cleaned = trimmed.replace(/\*\*/g, '').trim()
        if (cleaned) {
          elements.push(
            <p key={`para-${idx}`} className="text-text-secondary text-lg leading-relaxed mb-6">
              {cleaned}
            </p>
          )
        }
      }
    })

    if (currentList.length > 0) {
      const listElement = renderList(currentList)
      if (listElement) elements.push(listElement)
    }

    if (elements.length === 0) {
      return <div className="text-text-secondary">No description available.</div>
    }

    return <div>{elements}</div>
  } catch (error) {
    console.error('Error formatting description:', error)
    return <div className="text-text-secondary">Error loading description.</div>
  }
}

interface ProductDetailContentProps {
  product: Product
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const tracking = useTracking()
  const heroRef = useRef<HTMLElement>(null)
  const whatIsRef = useRef<HTMLElement>(null)
  const keyFeaturesRef = useRef<HTMLElement>(null)
  const featuresBentoRef = useRef<HTMLElement>(null)

  const parsedDescription = parseDescription(product.description)

  useEffect(() => {
    if (typeof window !== 'undefined' && product?.slug) {
      try {
        tracking.trackPageView(`/products/${product.slug}`)
      } catch (error) {
        console.error('Tracking error:', error)
      }
    }
  }, [tracking, product?.slug])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      if (heroRef.current) {
        const heroContent = heroRef.current.querySelector('.hero-content')
        const heroCard = heroRef.current.querySelector('.hero-card')
        
        if (heroContent) {
          gsap.from(heroContent.children, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
          })
        }
        
        if (heroCard) {
          gsap.from(heroCard, {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out',
          })
        }
      }

      // What is section animations
      if (whatIsRef.current) {
        gsap.from(whatIsRef.current.querySelectorAll('.feature-card'), {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: whatIsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Key features section animations
      if (keyFeaturesRef.current) {
        gsap.from(keyFeaturesRef.current.querySelectorAll('.feature-item'), {
          opacity: 0,
          x: -20,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: keyFeaturesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Features bento animations
      if (featuresBentoRef.current) {
        gsap.from(featuresBentoRef.current.querySelectorAll('.bento-card'), {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: featuresBentoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  if (!product) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-text-secondary">Product not found.</p>
          </div>
        </div>
      </section>
    )
  }

  // Get first 3 features for "What is" section
  const topFeatures = parsedDescription.features.slice(0, 3)

  return (
    <>
      {/* Dark Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="container-custom relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="hero-content">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/20 border border-brand-purple/30 rounded-full text-sm font-medium text-brand-purple">
                  <span className="w-2 h-2 bg-brand-purple rounded-full animate-pulse" />
                  {product.category || 'Product'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {product.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {product.excerpt}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-brand-purple text-white rounded-lg font-semibold hover:bg-brand-purple-light transition-colors"
                >
                  Try for free
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  Request Demo
                </Link>
              </div>
            </div>

            {/* Right Column - Video Card */}
            {product.videos && product.videos.length > 0 && (
              <div className="hero-card">
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    What will you <span className="text-brand-purple">build</span> today?
                  </h3>
                  <div className="relative rounded-xl overflow-hidden bg-gray-100">
                    <CloudinaryVideoPlayer videoUrl={product.videos} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What is Product Section */}
      {parsedDescription.intro && (
        <section 
          ref={whatIsRef}
          className="section-padding bg-background"
        >
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                What is <span className="text-brand-purple">{product.title.split(' - ')[0]}</span>?
              </h2>
              <p className="text-lg text-text-secondary">
                {parsedDescription.intro}
              </p>
            </div>

            {topFeatures.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topFeatures.map((feature, idx) => (
                  <div key={idx} className="feature-card bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-shadow">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-brand-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Key Features Section */}
      {parsedDescription.features.length > 0 && (
        <section 
          ref={keyFeaturesRef}
          className="section-padding bg-background-secondary"
        >
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                  Key Features
                </h2>
                <p className="text-lg text-text-secondary mb-8">
                  {parsedDescription.intro || 'Discover the powerful features that make this product stand out.'}
                </p>
                <div className="space-y-4">
                  {parsedDescription.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="feature-item flex items-start gap-4">
                      <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 text-brand-purple"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-text-secondary text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="feature-card bg-white rounded-2xl p-8 shadow-soft">
                {product.videos && product.videos.length > 0 ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100">
                    <CloudinaryVideoPlayer videoUrl={product.videos} />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-brand-purple/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Bento Section */}
      {parsedDescription.features.length > 0 && (
        <section 
          ref={featuresBentoRef}
          className="section-padding bg-background"
        >
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Features
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Create your own solution. Build, train, and customize for your business.
              </p>
            </div>

            <div className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedDescription.features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`bento-card bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow ${
                    idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-5 h-5 text-brand-purple"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Relevance AI Style */}
      {parsedDescription.benefits.length > 0 && (
        <section className="section-padding bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Why Choose This Solution?
                </h2>
                <p className="text-lg text-text-secondary">
                  Discover the benefits that make this product essential for your business
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parsedDescription.benefits.map((benefit, idx) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-purple/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-brand-purple"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-text-secondary text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </>
  )
}
