import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getProductBySlug, products } from '@/data/products'
import ProductDetailContent from './ProductDetailContent'

interface PageProps {
  params: { locale: string; slug: string }
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default function ProductDetailPage({ params: { locale, slug } }: PageProps) {
  setRequestLocale(locale)
  const product = getProductBySlug(slug)
  if (!product) notFound()
  return <ProductDetailContent product={product} />
}
