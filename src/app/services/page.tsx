import Services from '@/components/sections/Services'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services - FlowCobalt',
  description: 'Automation services to help your team save time and reduce errors',
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Our <span className="text-gradient-brand">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
              We offer flexible automation solutions to fit your needs, from quick audits to ongoing support.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <Services />

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Not Sure Which Service Fits?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your needs and find the best automation solution for your team.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

