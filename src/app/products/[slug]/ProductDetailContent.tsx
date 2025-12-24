'use client'

import { useEffect, useRef, useState } from 'react'
import { useTracking } from '@/lib/tracking'
import { Product } from '@/data/products'

// Cloudinary Video Player Component
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

interface ProductDetailContentProps {
  product: Product
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const tracking = useTracking()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      tracking.trackPageView(`/products/${product.slug}`)
    }
  }, [tracking, product.slug])

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
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
                {product.category || 'Product'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {product.title}
            </h1>
            <p className="text-xl text-text-secondary">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {product.videos && product.videos.length > 0 && (
        <section className="section-padding bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-soft bg-gray-900">
                <CloudinaryVideoPlayer videoUrl={product.videos} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Description Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary text-lg leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

