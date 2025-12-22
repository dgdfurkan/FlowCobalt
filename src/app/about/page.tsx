import About from '@/components/sections/About'
import Button from '@/components/ui/Button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - FlowCobalt',
  description: 'Learn about FlowCobalt and our mission to automate workflows',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              About <span className="text-gradient-brand">FlowCobalt</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              We build practical AI + n8n automations that reduce errors and free up your team&apos;s time.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <About />

      {/* CTA Section */}
      <section className="section-padding bg-background-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to Automate Your Workflows?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help your team achieve better results with automation.
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

