export interface Product {
  id: string
  slug: string
  title: string
  description: string
  excerpt: string
  videos: string[] // Cloudinary video URLs (max 15 seconds each, will loop)
  category?: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'product-1',
    title: 'Product Name 1',
    description: 'Detailed description of product 1',
    excerpt: 'Short excerpt about product 1',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1764716520/updates/nfxewooa6kmag2ysfirb.mov',
    ],
    category: 'Category 1',
    featured: true,
  },
  // Add more products as needed
]

// Helper function to get featured products (for homepage)
export function getFeaturedProducts(limit: number = 3): Product[] {
  return products.filter(p => p.featured).slice(0, limit)
}

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

