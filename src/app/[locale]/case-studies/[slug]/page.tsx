import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Metadata } from 'next'
import { getCaseStudyBySlug, getRelatedCaseStudies, caseStudies } from '@/data/case-studies'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Link } from '@/i18n/navigation'

interface PageProps {
  params: { locale: string; slug: string }
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params: { locale, slug } }: PageProps): Promise<Metadata> {
  const study = getCaseStudyBySlug(slug)
  if (!study) return { title: 'Case Study Not Found - FlowCobalt' }
  return { title: `${study.title} - FlowCobalt`, description: study.excerpt }
}

export default async function CaseStudyDetailPage({ params: { locale, slug } }: PageProps) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'caseStudies' })

  const study = getCaseStudyBySlug(slug)
  const relatedStudies = study ? getRelatedCaseStudies(slug, 3) : []

  if (!study) notFound()

  return (
    <>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/case-studies"
                className="text-brand-purple hover:text-brand-purple-light transition-colors inline-flex items-center"
              >
                {t('backToCaseStudies')}
              </Link>
            </div>
            <div className="mb-8">
              {study.industry && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-background-secondary text-text-secondary rounded-full mb-4">
                  {study.industry}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
                {study.title}
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-6">{study.excerpt}</p>
              <div className="inline-block px-6 py-3 bg-gradient-brand text-white rounded-lg font-semibold text-lg">
                {study.result}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {study.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm font-medium bg-background-secondary text-text-secondary rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('theChallenge')}</h2>
            <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">{study.challenge}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('ourSolution')}</h2>
            <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">{study.solution}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('results')}</h2>
            <ul className="space-y-4">
              {study.outcome.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand-purple font-bold text-xl mr-3">✓</span>
                  <span className="text-lg text-text-secondary">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {study.testimonial && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
                <blockquote className="text-xl md:text-2xl text-text-primary font-medium mb-6 italic">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-text-primary">{study.testimonial.author}</p>
                  <p className="text-text-secondary">{study.testimonial.role}, {study.testimonial.company}</p>
                </div>
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
              <Button href="/case-studies" variant="secondary" size="lg">{t('ctaViewMore')}</Button>
            </div>
          </div>
        </div>
      </section>

      {relatedStudies.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8 text-center">
                {t('relatedCaseStudies')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedStudies.map((relatedStudy) => (
                  <Card key={relatedStudy.id} href={`/case-studies/${relatedStudy.slug}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{relatedStudy.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-brand-purple font-semibold mb-2">{relatedStudy.result}</p>
                      <CardDescription className="text-sm">{relatedStudy.excerpt}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
