'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { products } from '@/data/products'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Cloudinary Video Player Component (same as Products.tsx)
function CloudinaryVideoPlayer({ 
  videoUrl, 
  className = '' 
}: { 
  videoUrl: string | string[]
  className?: string 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<string[]>([])

  useEffect(() => {
    const videoArray = Array.isArray(videoUrl) ? videoUrl : [videoUrl]
    setVideos(videoArray)
  }, [videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || videos.length === 0) return

    const currentVideo = videos[currentVideoIndex]
    if (!currentVideo) return

    // Use Cloudinary URL as-is (Cloudinary handles video optimization)
    video.src = currentVideo
    video.load()

    const handleEnded = () => {
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1)
      } else {
        setCurrentVideoIndex(0)
      }
    }

    const handleLoadedData = () => {
      video.play().catch(err => {
        console.warn('Autoplay prevented:', err)
      })
    }

    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [currentVideoIndex, videos])

  if (videos.length === 0) return null

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-xl ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
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

export default function ProductsList() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children)
        
        gsap.set(cards, { opacity: 0, y: 50 })
        
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
    <section ref={sectionRef} className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Video/GIF Wrapper */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {product.videos && product.videos.length > 0 ? (
                  <CloudinaryVideoPlayer 
                    videoUrl={product.videos} 
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 flex items-center justify-center">
                    <span className="text-text-secondary">No preview available</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-purple transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {product.excerpt}
                </p>
                <div className="flex items-center text-brand-purple font-medium text-sm group-hover:text-brand-purple-light transition-colors">
                  <span>Learn more</span>
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

