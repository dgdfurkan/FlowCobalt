'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { getFeaturedProducts } from '@/data/products'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Cloudinary Video Player Component
function CloudinaryVideoPlayer({ 
  videoUrl, 
  className = '' 
}: { 
  videoUrl: string
  className?: string 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<string[]>([])

  useEffect(() => {
    // If videoUrl is an array (multiple videos), use it; otherwise wrap in array
    const videoArray = Array.isArray(videoUrl) ? videoUrl : [videoUrl]
    setVideos(videoArray)
  }, [videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || videos.length === 0) return

    const currentVideo = videos[currentVideoIndex]
    if (!currentVideo) return

    // Use Cloudinary URL as-is (Cloudinary handles video optimization)
    // For better performance, Cloudinary URLs can include transformations like:
    // /video/upload/q_auto,f_auto,duration_15/v1764716520/...
    video.src = currentVideo
    video.load()

    const handleEnded = () => {
      // If there are more videos, play next; otherwise loop current
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1)
      } else {
        // Loop back to first video
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
        loop={videos.length === 1} // Only loop if single video
        muted
        playsInline
        preload="auto"
        style={{
          pointerEvents: 'none', // Disable video controls interaction
        }}
      />
    </div>
  )
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const featuredProducts = getFeaturedProducts(3)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children)
        
        // Set initial state (similar to Relevance AI's animation)
        gsap.set(cards, { opacity: 0, y: 50 })
        
        // Animate cards on scroll
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

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full text-sm font-medium text-text-secondary">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Products
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Our <span className="text-brand-purple">Products</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Discover our innovative solutions designed to transform your workflow
          </p>
        </div>

        <div 
          ref={cardsRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
        >
          {featuredProducts.map((product) => (
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

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center text-brand-purple hover:text-brand-purple-light font-semibold transition-colors"
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  )
}

