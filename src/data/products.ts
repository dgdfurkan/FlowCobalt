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
    slug: 'panela',
    title: 'Panela - E-Commerce Management & Research Platform',
    description: `Panela is an AI-powered business management and research platform designed for e-commerce entrepreneurs. The system automates e-commerce processes from product discovery to marketing strategies, enhanced with artificial intelligence.

**AI Features:**
- **Smart Ad Analysis Assistant (Creative Lab):** Analyzes your ad copy using Google's Gemini AI model, optimizes your target audience, and provides marketing strategies
- **Automatic Quiz Generator (Academy):** Automatically generates quiz questions from your educational content (fill-in-the-blank, matching, multiple choice)

**Automation Features:**
- **Automatic Meta Ad Scanner (Research):** Automatically finds companies running active ads on Facebook and Instagram, and adds products to your database
- **Smart Product Scoring System (Winner Hunter):** Automatically scores products from 0-100 (problem-solving, profit margin, trend analysis, social media engagement)
- **Automatic Data Organization:** Automatically migrates old-format links in your database to the new format

**Benefits:**
- Time savings with automated systems instead of manual research
- AI-powered marketing and product strategies
- Secure data storage (Supabase)
- Manage hundreds of products and ads on a single platform`,
    excerpt: 'AI-powered product discovery, ad analysis, and automated research platform for e-commerce entrepreneurs. A modern solution replacing Excel.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1766576155/Ekran_Kayd%C4%B1_2025-12-24_14.33.28_nw3zgk.mov',
    ],
    category: 'E-Commerce Management',
    featured: true,
  },
  {
    id: '2',
    slug: 'barcode-app',
    title: 'Barcode App - Enterprise Dealer Management System',
    description: `A powerful management system designed for corporate dealers, providing instant access to product barcodes and accelerating operations. **Built for Getir Dealers** - This enterprise solution powers Getir's dealer network, enabling seamless barcode management and product information access.

**Built for Getir Dealers:**
- **Enterprise-Grade Solution:** Currently powering Getir's extensive dealer network across multiple regions
- **Proven at Scale:** Trusted by one of the world's leading on-demand delivery platforms
- **Real-World Performance:** Handles thousands of daily transactions with reliability and speed

**Features:**
- **Lightning-Fast Barcode Search:** Instant access to product barcode information with sub-second response times
- **Real-Time Product Database:** Always up-to-date product information synchronized across all dealer locations
- **Enterprise Dealer Management:** Comprehensive management tools for corporate dealer networks
- **Intuitive User Interface:** User-friendly design that requires minimal training
- **Mobile-First Design:** Optimized for mobile devices used in warehouse and retail environments
- **Offline Capability:** Access critical information even when connectivity is limited

**Benefits:**
- **Operational Efficiency:** Reduce transaction times by up to 70% with instant barcode access
- **Scalability:** Built to handle enterprise-level dealer networks with thousands of users
- **Reliability:** Proven performance in high-volume, mission-critical environments
- **Cost Savings:** Eliminate manual lookup processes and reduce operational overhead
- **Better Customer Experience:** Faster service delivery improves customer satisfaction`,
    excerpt: 'Enterprise dealer management system powering Getir\'s dealer network. Instant barcode access for corporate dealers.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1764716003/updates/wxb01kgcd2ldkxocpr6a.mov',
    ],
    category: 'Enterprise Solutions',
    featured: true,
  },
]

// Helper function to get featured products (for homepage)
export function getFeaturedProducts(limit: number = 3): Product[] {
  return products.filter(p => p.featured).slice(0, limit)
}

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

