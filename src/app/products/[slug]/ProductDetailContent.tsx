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

// Component to format description with proper paragraphs, bold text, and lists
function FormattedDescription({ description }: { description: string }) {
  const lines = description.split('\n').filter(line => line.trim())
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let currentSectionTitle: string | null = null

  const renderList = (items: string[]) => {
    if (items.length === 0) return null
    return (
      <ul key={`list-${elements.length}`} className="list-disc list-inside mb-6 space-y-2 text-text-secondary">
        {items.map((item, idx) => {
          // Parse bold text in list items
          const parts = item.split(/(\*\*.*?\*\*)/g)
          return (
            <li key={idx} className="text-base leading-relaxed">
              {parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={partIdx} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
                }
                return <span key={partIdx}>{part}</span>
              })}
            </li>
          )
        })}
      </ul>
    )
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    
    // Section title (starts with **)
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':')) {
      // Render previous list if exists
      if (currentList.length > 0) {
        elements.push(renderList(currentList)!)
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
    else if (trimmed.length > 0) {
      // Render previous list if exists
      if (currentList.length > 0) {
        elements.push(renderList(currentList)!)
        currentList = []
      }
      
      // Parse bold text in paragraphs
      const parts = trimmed.split(/(\*\*.*?\*\*)/g)
      elements.push(
        <p key={`para-${idx}`} className="text-text-secondary text-lg leading-relaxed mb-6">
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIdx} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
            }
            return <span key={partIdx}>{part}</span>
          })}
        </p>
      )
    }
  })

  // Render remaining list
  if (currentList.length > 0) {
    elements.push(renderList(currentList)!)
  }

  return <div>{elements}</div>
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
              <FormattedDescription description={product.description} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

