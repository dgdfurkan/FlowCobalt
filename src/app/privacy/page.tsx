import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - FlowCobalt',
  description: 'FlowCobalt Privacy Policy - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-brand-purple hover:text-brand-purple-light mb-4 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-text-secondary">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-soft p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">1. Introduction</h2>
              <p className="text-text-secondary leading-relaxed">
                FlowCobalt (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">2.1 Automatically Collected Information</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>IP address and geolocation data (country, city, region)</li>
                <li>Browser type and version</li>
                <li>Device information (device type, operating system)</li>
                <li>Pages visited and time spent on each page</li>
                <li>Scroll depth and user interactions</li>
                <li>Referrer information (how you arrived at our site)</li>
                <li>Date and time of visits</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">2.2 Information You Provide</h3>
              <p className="text-text-secondary leading-relaxed">
                When you contact us through our contact form, we collect:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4 mt-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Company name (optional)</li>
                <li>Message content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li>To analyze website traffic and user behavior</li>
                <li>To improve our website and user experience</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To detect and prevent security threats</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our website. These technologies include:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with our website</li>
                <li><strong>Third-party Analytics:</strong> We may use Yandex Metrica for analytics purposes (only with your consent)</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">5. Data Storage and Security</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Your data is stored securely using:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li><strong>Supabase:</strong> Our primary database and backend service (hosted in secure data centers)</li>
                <li><strong>Yandex Metrica:</strong> Analytics data (only if you consent to cookies)</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">6. Data Retention</h2>
              <p className="text-text-secondary leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">7. Your Rights</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request access to your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for cookie usage</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">8. Third-Party Services</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4 mt-2">
                <li><strong>Supabase:</strong> Database and backend services</li>
                <li><strong>Yandex Metrica:</strong> Web analytics (optional, requires consent)</li>
                <li><strong>Telegram:</strong> Notification services (for internal use only)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-text-secondary leading-relaxed">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-text-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text-primary mb-4">11. Contact Us</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-background-secondary rounded-lg p-4">
                <p className="text-text-primary">
                  <strong>Email:</strong>{' '}
                  <a
                    href="/contact"
                    className="text-brand-purple hover:text-brand-purple-light"
                  >
                    Contact us through our contact form
                  </a>
                </p>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-200">
              <p className="text-sm text-text-secondary">
                This Privacy Policy is compliant with GDPR (General Data Protection Regulation) and KVKK (Turkish Personal Data Protection Law) requirements.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

