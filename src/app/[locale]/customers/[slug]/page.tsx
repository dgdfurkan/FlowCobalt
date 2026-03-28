import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import Image from 'next/image'
import { getCustomerStoryBySlug, customerStories } from '@/data/customer-stories'
import Button from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'

interface PageProps {
  params: { locale: string; slug: string }
}

export function generateStaticParams() {
  return customerStories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const story = getCustomerStoryBySlug(slug)
  if (!story) return { title: 'Customer Story Not Found - FlowCobalt' }
  return { title: `${story.title} - FlowCobalt`, description: story.excerpt }
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default async function CustomerStoryDetailPage({ params: { locale, slug } }: PageProps) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'customers' })

  const story = getCustomerStoryBySlug(slug)
  if (!story) notFound()

  const videoId = getYouTubeVideoId(story.videoUrl)
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` : null
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/customers" className="text-brand-purple hover:text-brand-purple-light transition-colors inline-flex items-center">
                {t('backToStories')}
              </Link>
            </div>
            <div className="mb-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-background-secondary text-text-secondary rounded-full">
                  {story.company}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">{story.title}</h1>
              <p className="text-xl md:text-2xl text-text-secondary">{story.excerpt}</p>
            </div>
          </div>
        </div>
      </section>

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
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {thumbnailUrl && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Image src={thumbnailUrl} alt={`${story.title} thumbnail`} fill className="object-cover opacity-0" loading="lazy" aria-hidden="true" unoptimized />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('about')} {story.company}</h2>
              <p className="text-lg text-text-secondary leading-relaxed">{story.excerpt}</p>
            </div>
          </div>
        </div>
      </section>

      {story.transcript && (
        <section className="section-padding bg-background-secondary">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('videoTranscript')}</h2>
              <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
                <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">{story.transcript}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{t('ctaTitle')}</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">{t('ctaSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary" size="lg">{t('ctaGetStarted')}</Button>
              <Button href="/customers" variant="secondary" size="lg">{t('ctaViewMore')}</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
