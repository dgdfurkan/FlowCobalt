import { setRequestLocale } from 'next-intl/server'
import Hero from '@/components/sections/Hero'
import TrustBlocks from '@/components/sections/TrustBlocks'
import Products from '@/components/sections/Products'
import CaseStudies from '@/components/sections/CaseStudies'
import Process from '@/components/sections/Process'

interface PageProps {
  params: { locale: string }
}

export default function HomePage({ params: { locale } }: PageProps) {
  setRequestLocale(locale)
  return (
    <>
      <Hero />
      <TrustBlocks />
      <Products />
      <CaseStudies />
      <Process />
    </>
  )
}
