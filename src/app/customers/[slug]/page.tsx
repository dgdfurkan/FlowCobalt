import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCustomerStoryBySlug, customerStories } from '@/data/customer-stories'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return customerStories.map((story) => ({
    slug: story.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const story = getCustomerStoryBySlug(params.slug)
  
  if (!story) {
    return {
      title: 'Customer Story Not Found - FlowCobalt',
    }
  }

  return {
    title: `${story.title} - FlowCobalt`,
    description: story.excerpt,
  }
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default function CustomerStoryDetailPage({ params }: PageProps) {
  const story = getCustomerStoryBySlug(params.slug)

  if (!story) {
    notFound()
  }

  const videoId = getYouTubeVideoId(story.videoUrl)
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` : null
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/customers"
                className="text-brand-purple hover:text-brand-purple-light transition-colors inline-flex items-center"
              >
                ← Back to Customer Stories
              </Link>
            </div>
            
            <div className="mb-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-background-secondary text-text-secondary rounded-full">
                  {story.company}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
                {story.title}
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary">
                {story.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {embedUrl && (
        <section className="section-padding bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-soft bg-gray-900">
                <iframe
                  src={embedUrl}
                  title={story.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  // Performance optimizations
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {/* Thumbnail fallback for better initial load */}
                {thumbnailUrl && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Image
                      src={thumbnailUrl}
                      alt={`${story.title} thumbnail`}
                      fill
                      className="object-cover opacity-0"
                      loading="lazy"
                      aria-hidden="true"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Company Info Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                About {story.company}
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                {story.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transcript Section (Placeholder for future) */}
      {story.transcript && (
        <section className="section-padding bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Video Transcript
              </h2>
              <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
                <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
                  {story.transcript}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to Build Your AI Workforce?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help transform your business with AI-powered automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary" size="lg">
                Get Started
              </Button>
              <Button href="/customers" variant="secondary" size="lg">
                View More Stories
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

