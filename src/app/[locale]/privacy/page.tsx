import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { Link } from '@/i18n/navigation'

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata.privacy' })
  return { title: t('title'), description: t('description') }
}

export default async function PrivacyPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'privacy' })

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
              <h2 className="text-2xl font-bold text-text-primary mb-4">1. Information We Collect</h2>
              <p className="text-text-secondary leading-relaxed mb-4">We collect information you provide directly to us, such as when you fill out our contact form:</p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Messages and inquiries</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>
              <p className="text-text-secondary leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you information about our services</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">3. Cookies and Analytics</h2>
              <p className="text-text-secondary leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website. We use Yandex Metrica for analytics to understand how visitors interact with our site. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. Data Security</h2>
              <p className="text-text-secondary leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">5. Your Rights</h2>
              <p className="text-text-secondary leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">6. Contact Us</h2>
              <div className="bg-background-secondary rounded-lg p-4">
                <p className="text-text-primary">
                  <strong>Email:</strong>{' '}
                  <Link href="/contact" className="text-brand-purple hover:text-brand-purple-light">
                    {t('contactUs')}
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
