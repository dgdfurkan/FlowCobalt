import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProductBySlug, products } from '@/data/products'
import ProductDetailContent, { LocalizedProductData } from './ProductDetailContent'

interface PageProps {
  params: { locale: string; slug: string }
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductDetailPage({ params: { locale, slug } }: PageProps) {
  setRequestLocale(locale)

  const product = getProductBySlug(slug)
  if (!product) notFound()

  const t = await getTranslations({ locale, namespace: 'productItems' })

  const localizedData: LocalizedProductData = {
    title: t(`${slug}.title`),
    excerpt: t(`${slug}.excerpt`),
    category: t(`${slug}.category`),
    intro: t(`${slug}.intro`),
    features: t.raw(`${slug}.features`) as LocalizedProductData['features'],
    benefits: t.raw(`${slug}.benefits`) as LocalizedProductData['benefits'],
    beforeAfter: t.raw(`${slug}.beforeAfter`) as LocalizedProductData['beforeAfter'],
    specialSections: t.raw(`${slug}.specialSections`) as LocalizedProductData['specialSections'],
  }

  return <ProductDetailContent product={product} localizedData={localizedData} />
}
