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
  {
    id: '3',
    slug: 'courier-shift-planner',
    title: 'Courier Shift Planning System',
    description: `An intelligent web application designed for courier companies and businesses to simplify weekly shift planning. Manage your couriers' working hours, days off, and shift balances from a single screen.

**Project Purpose:**
One of the biggest challenges in courier management is creating fair and balanced shift schedules. This system:

- **Ensures Fair Work Distribution:** Automatically calculates each courier's working hours
- **Saves Time:** Visual and quick editing instead of manual planning
- **Prevents Errors:** Instantly shows missing or excess working hours
- **Brings Transparency:** All team members can easily view the schedule

**Key Features:**

**Visual and Easy Planning:**
- 7-day weekly view to see all shifts at a glance
- Drag-and-drop to reorder couriers
- Assign different colors for each day to make the schedule more readable

**Smart Time Management:**
- Edit shift times with a single click (start-end)
- Quick adjustment with increase/decrease buttons
- Mark days off as "OFF"

**Automatic Calculations:**
- Automatically calculates each courier's total working hours
- Shows missing, excess, or balanced status based on target hours
- Color-coded indicators for instant understanding:
  - Red: Insufficient working hours
  - Green: Balanced or excess working hours

**Flexible Courier Management:**
- Add new couriers, edit existing ones
- Assign emoji avatars for each courier (visual recognition ease)
- Temporarily hide or permanently delete couriers

**Day Hiding Feature:**
- Hide unnecessary days to simplify the screen
- Restore hidden days with a single click
- Focus on what matters

**Automation Features:**

**Data Saving and Loading:**
- Save your entire shift plan in JSON format
- Load previous plans to continue
- Work without risk of data loss

**Excel Report Generation:**
- Download Excel report with a single click
- Includes detailed working hours for all couriers
- Ready format for accounting and reporting

**Automatic Status Updates:**
- Automatically recalculates total durations when hours change
- Updates missing/excess statuses in real-time
- No manual calculation required

**Default Values:**
- Automatic default hours for newly added couriers
- Set default start/end times from settings
- Automate repetitive tasks

**Who Can Use It?**
- Courier companies - Motorcycle courier, bicycle courier teams
- Restaurants - Delivery team management
- Logistics companies - Distribution team planning
- Small businesses - Any team with shift workers

**Why This System?**

**Before:** Manual calculation in Excel, complex tables, high error risk, time loss, data loss risk

**After:** Automatic calculation, visual and colorful interface, automatic error control, planning in minutes, safe save/load

**Quick Start:**
1. Add Couriers - Create courier profiles with name and emoji
2. Set Hours - Enter start-end times for each day
3. Check - Review automatically calculated total hours
4. Save - Save your plan as JSON or download Excel report

**Features Summary:**
- 7-day weekly shift view
- Drag-and-drop courier reordering
- Automatic working hour calculation
- Missing/excess hour warnings
- Day coloring and hiding
- JSON save/load
- Excel report generation
- Emoji avatar support
- Responsive design (mobile compatible)
- User-friendly interface

Simplify courier shift planning, save time, manage your team more efficiently!`,
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

