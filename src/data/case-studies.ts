export interface CaseStudy {
  id: string
  title: string
  slug: string
  excerpt: string
  result: string
  industry?: string
  challenge: string
  solution: string
  outcome: string[]
  testimonial?: {
    author: string
    role: string
    company: string
    quote: string
  }
  image?: string
  tags: string[]
  publishedAt: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'E-commerce Order Processing Automation',
    slug: 'ecommerce-order-processing-automation',
    excerpt: 'Automated order processing workflow reduced manual work by 50% and eliminated errors.',
    result: '50% time saved',
    industry: 'E-commerce',
    challenge: 'The team was spending 4+ hours daily manually processing orders, checking inventory, updating CRM, and sending confirmation emails. Human errors were causing delays and customer complaints.',
    solution: 'We built an n8n workflow that automatically processes orders from the e-commerce platform, checks inventory in real-time, updates the CRM system, sends confirmation emails, and notifies the warehouse team. The workflow handles edge cases and retries failed operations automatically.',
    outcome: [
      'Reduced order processing time from 4 hours to 2 hours daily',
      'Eliminated 100% of manual data entry errors',
      'Improved customer satisfaction with instant order confirmations',
      'Freed up team time for strategic tasks'
    ],
    testimonial: {
      author: 'Sarah Johnson',
      role: 'Operations Manager',
      company: 'TechRetail Co.',
      quote: 'FlowCobalt transformed our operations. What used to take hours now happens automatically, and we haven\'t had a single error since implementation.'
    },
    tags: ['E-commerce', 'CRM', 'Email Automation', 'n8n'],
    publishedAt: '2024-12-01'
  },
  {
    id: '2',
    title: 'Customer Support Ticket Routing',
    slug: 'customer-support-ticket-routing',
    excerpt: 'AI-powered ticket routing system reduced response time by 90% and improved customer satisfaction.',
    result: '90% error reduction',
    industry: 'SaaS',
    challenge: 'Customer support tickets were being manually assigned, causing delays and routing to wrong team members. Critical issues were sometimes missed, leading to customer churn.',
    solution: 'We implemented an AI agent that analyzes incoming support tickets, categorizes them by urgency and topic, routes them to the appropriate team member based on expertise and workload, and escalates critical issues automatically.',
    outcome: [
      'Reduced average response time from 2 hours to 12 minutes',
      'Eliminated 90% of routing errors',
      'Improved customer satisfaction score by 35%',
      'Enabled 24/7 ticket handling without additional staff'
    ],
    tags: ['AI', 'Customer Support', 'Automation', 'SaaS'],
    publishedAt: '2024-11-15'
  },
  {
    id: '3',
    title: 'Invoice Processing Workflow',
    slug: 'invoice-processing-workflow',
    excerpt: 'Automated invoice processing workflow delivered in 2 weeks, processing 500+ invoices monthly.',
    result: '2 weeks delivery',
    industry: 'Finance',
    challenge: 'The finance team was manually processing invoices, extracting data, matching with purchase orders, and entering into accounting software. This process was time-consuming and prone to errors.',
    solution: 'We created an automated workflow that extracts invoice data using OCR, matches invoices with purchase orders, validates amounts, and automatically enters approved invoices into the accounting system. The workflow flags discrepancies for manual review.',
    outcome: [
      'Processes 500+ invoices monthly automatically',
      'Reduced processing time from 15 minutes to 2 minutes per invoice',
      'Eliminated data entry errors',
      'Improved cash flow visibility with real-time processing'
    ],
    tags: ['Finance', 'OCR', 'Accounting', 'Workflow'],
    publishedAt: '2024-11-01'
  },
  {
    id: '4',
    title: 'Lead Qualification Automation',
    slug: 'lead-qualification-automation',
    excerpt: 'Automated lead qualification system increased qualified leads by 40% and reduced sales team workload.',
    result: '40% more qualified leads',
    industry: 'B2B Sales',
    challenge: 'Sales team was spending too much time on unqualified leads. Manual qualification process was inconsistent and slow, causing missed opportunities.',
    solution: 'We built an AI-powered lead qualification system that analyzes incoming leads, scores them based on company data and behavior, enriches lead information automatically, and routes only qualified leads to the sales team.',
    outcome: [
      'Increased qualified lead rate by 40%',
      'Reduced sales team time spent on unqualified leads by 60%',
      'Improved lead response time from 24 hours to 2 hours',
      'Better lead tracking and follow-up automation'
    ],
    tags: ['Sales', 'Lead Generation', 'AI', 'CRM'],
    publishedAt: '2024-10-20'
  },
  {
    id: '5',
    title: 'Data Migration Automation',
    slug: 'data-migration-automation',
    excerpt: 'Automated data migration from legacy system reduced migration time by 75% and eliminated data loss.',
    result: '75% faster migration',
    industry: 'Technology',
    challenge: 'Company needed to migrate customer data from a legacy system to a new CRM. Manual migration would take months and risk data loss or corruption.',
    solution: 'We created an automated migration workflow that extracts data from the legacy system, validates and cleanses data, transforms it to match the new system format, and imports it in batches with error handling and rollback capabilities.',
    outcome: [
      'Completed migration in 2 weeks instead of 3 months',
      'Zero data loss or corruption',
      'Automated data validation and cleansing',
      'Created reusable migration templates for future projects'
    ],
    tags: ['Data Migration', 'CRM', 'ETL', 'Automation'],
    publishedAt: '2024-10-05'
  }
]

// Helper function to get case study by slug
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug)
}

// Helper function to get related case studies
export function getRelatedCaseStudies(currentSlug: string, limit: number = 3): CaseStudy[] {
  return caseStudies
    .filter(study => study.slug !== currentSlug)
    .slice(0, limit)
}

