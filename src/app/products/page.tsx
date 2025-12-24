'use client'

import { useEffect } from 'react'
import ProductsList from '@/components/sections/ProductsList'
import { useTracking } from '@/lib/tracking'

export default function ProductsPage() {
  const tracking = useTracking()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      tracking.trackPageView('/products')
    }
  }, [tracking])

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full text-sm font-medium text-text-secondary">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Products
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Our <span className="text-brand-purple">Products</span>
            </h1>
            <p className="text-lg text-text-secondary">
              Explore our complete range of innovative solutions designed to transform your workflow
            </p>
          </div>
        </div>
      </section>

      {/* Products List */}
      <ProductsList />
    </>
  )
}

