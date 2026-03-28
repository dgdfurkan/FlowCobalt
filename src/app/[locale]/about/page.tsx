import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import About from '@/components/sections/About'
import Button from '@/components/ui/Button'

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata.about' })
  return { title: t('title'), description: t('description') }
}

export default async function AboutPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              {t('pageTitle')} <span className="text-gradient-brand">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              {t('pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <About />

      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              {t('ctaSubtitle')}
            </p>
            <Button href="/contact" variant="primary" size="lg">
              {t('ctaButton')}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
