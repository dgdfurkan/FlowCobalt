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
              <h2 className="text-2xl font-bold text-text-primary mb-4">1. Agreement to Terms</h2>
              <p className="text-text-secondary leading-relaxed">
                By accessing or using FlowCobalt&apos;s website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">2. Description of Service</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                FlowCobalt provides automation and workflow services, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>Automation audit and consulting services</li>
                <li>Custom workflow development</li>
                <li>AI-powered automation solutions</li>
                <li>Process optimization services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">3. Use of Service</h2>
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">3.1 Acceptable Use</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use our services for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. Intellectual Property</h2>
              <p className="text-text-secondary leading-relaxed">
                All content, features, and functionality of our website and services are the exclusive property of FlowCobalt and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">5. Service Availability</h2>
              <p className="text-text-secondary leading-relaxed">
                We strive to provide continuous and reliable service, but we do not guarantee that our services will be available at all times. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">6. Limitation of Liability</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                To the maximum extent permitted by law, FlowCobalt shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">7. Contact Information</h2>
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
              <p className="text-sm text-text-secondary">
                By using FlowCobalt&apos;s services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
