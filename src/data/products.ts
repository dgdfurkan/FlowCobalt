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
    id: '4',
    slug: 'kibele',
    title: 'Kibele - AI Creative Partner & Ecosystem',
    description: `Kibele is a digital ecosystem designed to organize the chaos of early-stage creative thinking and elevate the creative process — not just a tool, but an intelligent partner that triggers your creativity and supports you from first spark to execution.

**Why We Built It:**
- Lone Creator Problem: Creative individuals need a dedicated sounding board to develop ideas — Kibele fills that role autonomously
- Scattered Inspiration: Visual references, sketches, and AI support unified under one roof to dramatically speed up the creative workflow
- Community-Driven: Opens ideas to sharing, fostering a culture of collective and collaborative creativity

**Core Features:**
- Inspiration Rooms: Collaborative digital workspaces customized for each project or interest area, keeping context always close at hand
- Kibele AI Partner: An intelligent assistant that converses like a trusted friend, provides encouragement, and generates creative ideas on demand
- Visual Memory Bank: Integrated research system with instant access to global artworks and design examples — no more tab-hopping
- Shared Sketchpad: Interactive canvas for simultaneous drawing, note-taking, and mind-mapping with teammates in real-time
- Idea Archive: Personal library that organizes all developed ideas and conversations in a structured, searchable format

**Benefits:**
- Zero Blank-Page Fear: AI partner sparks the first idea the moment you need it — no more staring at an empty canvas
- Real-Time Team Sync: Everyone stays aligned on the same visual plane, eliminating endless alignment meetings
- Hours Saved Weekly: Stop switching between Pinterest, Behance, and browser tabs — everything lives in one place
- Motivation on Demand: Supportive AI language keeps you in flow and reduces creative stress

**Before & After:**
- Blank page fear blocks every creative start | AI partner sparks ideas the moment you open the app
- Inspiration scattered across Pinterest, Behance, and browser tabs | All references organized in one Visual Memory Bank
- Team alignment takes hours of back-and-forth messages | Everyone synced on a shared canvas in real-time
- Ideas lost in chats, sticky notes, and random files | Everything archived and instantly searchable in Idea Archive`,
    excerpt: 'AI-powered creative ecosystem that eliminates blank-page fear. Inspiration rooms, AI partner, and real-time collaboration — all in one place.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1774625893/dbdfccfd-b5a7-4929-873e-c82d793e2de9_ubiqps.mp4',
    ],
    category: 'AI & Creative Tools',
    featured: true,
  },
  {
    id: '5',
    slug: 'busracrafts',
    title: 'BusraCrafts - Digital Recipe Book for Knitters',
    description: `BusraCrafts is a digital recipe journal that brings all your knitting and handcraft recipes together in one place — making them easy to organize, find, and share. Tagline: "Stitch by stitch, digitally yours." Every step, every photo, every pattern stored as reliably as a cherished handwritten notebook, but searchable, shareable, and always in your pocket.

**Core Features:**
- Personal Library: Add, edit, and delete recipes; organize with smart categories; enrich entries with step-by-step photos
- Discover Feed: Browse community-shared recipes, apply filters, like and comment, and save favorites to personal collections
- Lists & Progress Tracking: Group recipes into custom lists such as "This Week's Projects" and track completion status
- Smart Search: Full-text search across your entire recipe library in milliseconds
- Accounts & Roles: Members can publish recipes; visitors can freely browse without creating an account
- One-Touch Sharing: Export any recipe as an elegant visual card to share via message or social media
- PWA Experience: Opens in the browser and installs to home screen for a full native-app feel

**Benefits:**
- Never Lose a Recipe Again: Every pattern centralized, searchable, and accessible anytime — even offline
- Crystal-Clear Instructions: Structured photo-guided steps eliminate confusion and missing details
- Instant Sharing: Share any recipe as a beautiful card or direct link in one tap
- Community Discovery: Find new patterns and techniques through a curated community feed
- Always With You: Mobile-first PWA works on any device with no app store download required

**Before & After:**
- Recipes scattered across notebooks, photos, and WhatsApp messages | All organized in one searchable digital library
- Steps missing or out of order with photos buried in the camera roll | Step-by-step with embedded photos, crystal clear
- Sharing means typing the whole recipe out again | One-tap export as a visual card or shareable link
- "Who shared that pattern?" — lost somewhere in message threads | Community feed with collections and proper attribution
- Carrying a physical notebook everywhere you go | Entire library in your pocket, synced across all devices`,
    excerpt: 'Digital companion for knitters to collect, organize, and share handcraft recipes. Your entire stitch library — always in your pocket, always searchable.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1774623520/Ekran_Kayd%C4%B1_2026-03-27_09.58.16_calmgi.mov',
    ],
    category: 'Personal & Lifestyle Apps',
    featured: true,
  },
  {
    id: '1',
    slug: 'panela',
    title: 'Panela - E-Commerce Management & Research Platform',
    description: `Panela is an AI-powered business management and research platform designed for e-commerce entrepreneurs. The system automates e-commerce processes from product discovery to marketing strategies, enhanced with artificial intelligence.

**AI Features:**
Smart Ad Analysis Assistant (Creative Lab): Analyzes your ad copy using Google's Gemini AI model, optimizes your target audience, and provides marketing strategies
Automatic Quiz Generator (Academy): Automatically generates quiz questions from your educational content (fill-in-the-blank, matching, multiple choice)

**Automation Features:**
Automatic Meta Ad Scanner (Research): Automatically finds companies running active ads on Facebook and Instagram, and adds products to your database
Smart Product Scoring System (Winner Hunter): Automatically scores products from 0-100 (problem-solving, profit margin, trend analysis, social media engagement)
Automatic Data Organization: Automatically migrates old-format links in your database to the new format

**Benefits:**
Time Savings: Automated systems replace manual research, saving hours every week
AI-Powered Strategies: Leverage artificial intelligence for smarter marketing and product decisions
Secure Data Storage: Enterprise-grade security with Supabase backend
Unified Platform: Manage hundreds of products and ads from a single dashboard`,
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
    description: `A powerful management system designed for corporate dealers, providing instant access to product barcodes and accelerating operations. Built for Getir Dealers - This enterprise solution powers Getir's dealer network, enabling seamless barcode management and product information access.

**Built for Getir Dealers:**
Enterprise-Grade Solution: Currently powering Getir's extensive dealer network across multiple regions
Proven at Scale: Trusted by one of the world's leading on-demand delivery platforms
Real-World Performance: Handles thousands of daily transactions with reliability and speed

**Features:**
Lightning-Fast Barcode Search: Instant access to product barcode information with sub-second response times
Real-Time Product Database: Always up-to-date product information synchronized across all dealer locations
Enterprise Dealer Management: Comprehensive management tools for corporate dealer networks
Intuitive User Interface: User-friendly design that requires minimal training
Mobile-First Design: Optimized for mobile devices used in warehouse and retail environments
Offline Capability: Access critical information even when connectivity is limited

**Benefits:**
Operational Efficiency: Reduce transaction times by up to 70% with instant barcode access
Scalability: Built to handle enterprise-level dealer networks with thousands of users
Reliability: Proven performance in high-volume, mission-critical environments
Cost Savings: Eliminate manual lookup processes and reduce operational overhead
Better Customer Experience: Faster service delivery improves customer satisfaction`,
    excerpt: 'Enterprise dealer management system powering Getir\'s dealer network. Instant barcode access for corporate dealers.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1764716003/updates/wxb01kgcd2ldkxocpr6a.mov',
    ],
    category: 'Enterprise Solutions',
    featured: true,
  },
  {
    id: '3',
    slug: 'courier-shift-planner',
    title: 'Courier Shift Planning System',
    description: `An intelligent web application designed for courier companies and businesses to simplify weekly shift planning. Manage your couriers' working hours, days off, and shift balances from a single screen.

One of the biggest challenges in courier management is creating fair and balanced shift schedules. This system ensures fair work distribution, saves time with visual editing, prevents errors with instant validation, and brings transparency to your team.

**Features:**
Visual Weekly Planning: 7-day weekly view to see all shifts at a glance with drag-and-drop reordering
Smart Time Management: Edit shift times with a single click, quick adjustment buttons, and easy day-off marking
Automatic Calculations: Real-time calculation of total working hours with color-coded status indicators
Flexible Courier Management: Add, edit, hide, or delete couriers with emoji avatar support
Day Hiding Feature: Simplify your view by hiding unnecessary days and restoring them instantly
Data Export: Save plans in JSON format and generate Excel reports with a single click
Real-Time Updates: Automatic recalculation when hours change, no manual work required
Default Settings: Configure default hours and times for new couriers automatically

**Benefits:**
Time Savings: Replace hours of manual Excel planning with minutes of visual editing
Error Prevention: Automatic validation prevents scheduling mistakes and missing coverage
Fair Distribution: Ensure balanced work hours across all team members automatically
Professional Reports: Generate Excel reports ready for accounting and management review
User-Friendly Interface: Intuitive design requires no training, works on all devices
Data Security: Safe JSON save/load system prevents data loss and enables easy backup`,
    excerpt: 'Intelligent shift planning system for courier companies. Visual weekly scheduling with automatic hour calculations and Excel reporting.',
    videos: [
      'https://res.cloudinary.com/dppf64uyp/video/upload/v1766582675/Ekran_Kayd%C4%B1_2025-12-24_16.22.40_bdvh6u.mov',
    ],
    category: 'Workforce Management',
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

