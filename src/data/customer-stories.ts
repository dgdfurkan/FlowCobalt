export interface CustomerStory {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  logo: string
  videoUrl: string // YouTube URL
  company: string
  transcript?: string // Gelecek için
}

export const customerStories: CustomerStory[] = [
  {
    id: '1',
    slug: 'send-payments',
    title: 'Inside Send Payments\' AI-First Strategy',
    excerpt: 'How Send Payments leveraged AI to transform their payment processing workflow.',
    coverImage: '/images/customers/send-payments-cover.jpg',
    logo: '/images/customers/send-payments-logo.svg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder - gerçek video URL'i eklenecek
    company: 'Send Payments',
  },
  {
    id: '2',
    slug: 'qualified',
    title: 'How Qualified Scaled with an AI Workforce of 35+ Agents',
    excerpt: 'Discover how Qualified built and managed a large-scale AI workforce to automate their sales processes.',
    coverImage: '/images/customers/qualified-cover.jpg',
    logo: '/images/customers/qualified-logo.svg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    company: 'Qualified',
  },
  {
    id: '3',
    slug: 'safetyculture',
    title: 'SafetyCulture recruited an AI Agent and 3x\'d meetings',
    excerpt: 'Learn how SafetyCulture increased meeting efficiency by 3x with AI-powered automation.',
    coverImage: '/images/customers/safetyculture-cover.jpg',
    logo: '/images/customers/safetyculture-logo.svg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    company: 'SafetyCulture',
  },
]

// Helper function to get customer story by slug
export function getCustomerStoryBySlug(slug: string): CustomerStory | undefined {
  return customerStories.find(story => story.slug === slug)
}

// Helper function to get featured customer stories (for homepage)
export function getFeaturedCustomerStories(limit: number = 3): CustomerStory[] {
  return customerStories.slice(0, limit)
}

