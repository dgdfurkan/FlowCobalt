import CaseStudiesList from '@/components/sections/CaseStudiesList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies - FlowCobalt',
  description: 'Explore our success stories and see how we\'ve helped teams automate their workflows',
}

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Our <span className="text-gradient-brand">Success Stories</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              Discover how we&apos;ve helped companies automate their workflows, reduce errors, and free up their teams&apos; time.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies List */}
      <CaseStudiesList />
    </>
  )
}

