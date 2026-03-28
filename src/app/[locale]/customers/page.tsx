import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import CustomerStoriesList from '@/components/sections/CustomerStoriesList'

interface PageProps {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata.customers' })
  return { title: t('title'), description: t('description') }
}

export default async function CustomersPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'customers' })

  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full text-sm font-medium text-text-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('pill')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              {t('pageTitle')} <span className="text-gradient-brand">{t('pageTitleHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              {t('pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <CustomerStoriesList />
    </>
  )
}
