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
    setVideos(videoArray.filter(Boolean)) // Filter out any empty/null values
  }, [videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video || videos.length === 0) return

    const currentVideo = videos[currentVideoIndex]
    if (!currentVideo || typeof currentVideo !== 'string') return

    try {
      // Use Cloudinary URL as-is (Cloudinary handles video optimization)
      video.src = currentVideo
      video.load()

      const handleLoadedMetadata = () => {
        try {
          // Get video's natural aspect ratio
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
        // Try next video if available
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
            // Parse bold text in list items
            const parts = item.split(/(\*\*.*?\*\*)/g)
            return (
              <li key={idx} className="text-base leading-relaxed">
                {parts.map((part, partIdx) => {
                  if (part && part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={partIdx} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
                  }
                  return <span key={partIdx}>{part || ''}</span>
                })}
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
      
      // Section title (starts with **)
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':')) {
        // Render previous list if exists
        if (currentList.length > 0) {
          const listElement = renderList(currentList)
          if (listElement) elements.push(listElement)
          currentList = []
        }
        currentSectionTitle = trimmed.slice(2, -2)
        elements.push(
          <h3 key={`title-${idx}`} className="text-2xl font-bold text-text-primary mt-8 mb-4">
            {currentSectionTitle}
          </h3>
        )
      }
      // List item (starts with -)
      else if (trimmed.startsWith('- ')) {
        currentList.push(trimmed.slice(2))
      }
      // Regular paragraph
      else {
        // Render previous list if exists
        if (currentList.length > 0) {
          const listElement = renderList(currentList)
          if (listElement) elements.push(listElement)
          currentList = []
        }
        
        // Parse bold text in paragraphs
        const parts = trimmed.split(/(\*\*.*?\*\*)/g)
        elements.push(
          <p key={`para-${idx}`} className="text-text-secondary text-lg leading-relaxed mb-6">
            {parts.map((part, partIdx) => {
              if (part && part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIdx} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
              }
              return <span key={partIdx}>{part || ''}</span>
            })}
          </p>
        )
      }
    })

    // Render remaining list
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

  useEffect(() => {
    if (typeof window !== 'undefined' && product?.slug) {
      try {
        tracking.trackPageView(`/products/${product.slug}`)
      } catch (error) {
        console.error('Tracking error:', error)
      }
    }
  }, [tracking, product?.slug])

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
            <p className="text-xl text-text-secondary leading-relaxed">
              {product.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {product.videos && product.videos.length > 0 && (
        <section className="section-padding bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-xl overflow-hidden shadow-soft">
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
              <FormattedDescription description={product.description} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

