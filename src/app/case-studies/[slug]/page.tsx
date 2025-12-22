import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCaseStudyBySlug, getRelatedCaseStudies, caseStudies } from '@/data/case-studies'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const study = getCaseStudyBySlug(params.slug)
  
  if (!study) {
    return {
      title: 'Case Study Not Found - FlowCobalt',
    }
  }

  return {
    title: `${study.title} - FlowCobalt`,
    description: study.excerpt,
  }
}

export default function CaseStudyDetailPage({ params }: PageProps) {
  const study = getCaseStudyBySlug(params.slug)
  const relatedStudies = study ? getRelatedCaseStudies(params.slug, 3) : []

  if (!study) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/case-studies"
                className="text-brand-purple hover:text-brand-purple-light transition-colors inline-flex items-center"
              >
                ← Back to Case Studies
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
              <p className="text-xl md:text-2xl text-text-secondary mb-6">
                {study.excerpt}
              </p>
              <div className="inline-block px-6 py-3 bg-gradient-brand text-white rounded-lg font-semibold text-lg">
                {study.result}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-medium bg-background-secondary text-text-secondary rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              The Challenge
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
              {study.challenge}
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Our Solution
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
              {study.solution}
            </p>
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Results
            </h2>
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

      {/* Testimonial Section */}
      {study.testimonial && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
                <blockquote className="text-xl md:text-2xl text-text-primary font-medium mb-6 italic">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-bold text-text-primary">
                    {study.testimonial.author}
                  </p>
                  <p className="text-text-secondary">
                    {study.testimonial.role}, {study.testimonial.company}
                  </p>
                </div>
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
              Ready to Automate Your Workflows?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help your team achieve similar results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" variant="primary" size="lg">
                Get Started
              </Button>
              <Button href="/case-studies" variant="secondary" size="lg">
                View More Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedStudies.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8 text-center">
                Related Case Studies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedStudies.map((relatedStudy) => (
                  <Card key={relatedStudy.id} href={`/case-studies/${relatedStudy.slug}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{relatedStudy.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-brand-purple font-semibold mb-2">
                        {relatedStudy.result}
                      </p>
                      <CardDescription className="text-sm">
                        {relatedStudy.excerpt}
                      </CardDescription>
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

