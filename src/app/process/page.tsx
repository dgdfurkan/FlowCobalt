import ProcessDetail from '@/components/sections/ProcessDetail'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Process - FlowCobalt',
  description: 'Learn about our simple, proven process to automate your workflows',
}

export default function ProcessPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              How We <span className="text-gradient-brand">Work</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              A simple, proven process to automate your workflows in days, not months.
            </p>
          </div>
        </div>
      </section>

      {/* Process Detail */}
      <ProcessDetail />

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to Start?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s begin with a discovery call to understand your automation needs.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

