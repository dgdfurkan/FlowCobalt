import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata.terms' })
  return { title: t('title'), description: t('description') }
}

export default async function TermsPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'terms' })

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-brand-purple hover:text-brand-purple-light mb-4 inline-block">
              {t('backToHome')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">{t('title')}</h1>
            <p className="text-text-secondary">
              {t('lastUpdated')} {new Date().toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s1Title')}</h2>
              <p className="text-text-secondary leading-relaxed">{t('s1Text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s2Title')}</h2>
              <p className="text-text-secondary leading-relaxed mb-4">{t('s2Intro')}</p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>{t('s2i1')}</li>
                <li>{t('s2i2')}</li>
                <li>{t('s2i3')}</li>
                <li>{t('s2i4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s3Title')}</h2>
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">{t('s3aTitle')}</h3>
              <p className="text-text-secondary leading-relaxed mb-4">{t('s3aIntro')}</p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>{t('s3ai1')}</li>
                <li>{t('s3ai2')}</li>
                <li>{t('s3ai3')}</li>
                <li>{t('s3ai4')}</li>
                <li>{t('s3ai5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s4Title')}</h2>
              <p className="text-text-secondary leading-relaxed">{t('s4Text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s5Title')}</h2>
              <p className="text-text-secondary leading-relaxed">{t('s5Text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s6Title')}</h2>
              <p className="text-text-secondary leading-relaxed mb-4">{t('s6Text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">{t('s7Title')}</h2>
              <div className="bg-background-secondary rounded-lg p-4">
                <p className="text-text-primary">
                  <strong>Email:</strong>{' '}
                  <Link href="/contact" className="text-brand-purple hover:text-brand-purple-light">
                    {t('contactUs')}
                  </Link>
                </p>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
              <p className="text-sm text-text-secondary">{t('s7FooterText')}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
