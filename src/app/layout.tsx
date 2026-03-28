import type { Metadata } from 'next'
import ScrollTracker from '@/components/tracking/ScrollTracker'
import YandexMetricaLoader from '@/components/tracking/YandexMetricaLoader'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'FlowCobalt',
  description: 'Automated workflows in days, not months.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        <ScrollTracker />
        <YandexMetricaLoader />
        {children}
      </body>
    </html>
  )
}
