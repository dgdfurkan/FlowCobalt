import { notFound } from 'next/navigation'
import { getProductBySlug, products } from '@/data/products'
import ProductDetailContent from './ProductDetailContent'

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailContent product={product} />
}

