'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

interface Visitor {
  id: string
  ip_address: string
  country: string | null
  city: string | null
  region: string | null
  visit_count: number
  first_seen_at: string
  last_seen_at: string
  is_muted: boolean
}

export default function VisitorsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [visitors, setVisitors] = useState<Visitor[]>([])

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      router.push('/admin/login')
      return
    }

    // Check auth
    if (typeof window === 'undefined') {
      router.push('/admin/login')
      return
    }

    const storedUser = sessionStorage.getItem('admin_user')
    if (!storedUser) {
      router.push('/admin/login')
      return
    }

    loadVisitors()
    trackAdminPanelAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const trackAdminPanelAccess = async () => {
    if (!isSupabaseAvailable()) return
    
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      await fetch(`${supabaseUrl}/functions/v1/track-admin-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          accessType: 'admin_panel',
          pagePath: '/admin/visitors',
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Error tracking admin panel access:', error)
    }
  }

  const loadVisitors = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('last_seen_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setVisitors(data || [])
    } catch (error) {
      console.error('Error loading visitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Visitors
            </h1>
            <p className="text-text-secondary">
              View all visitors and their details
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    First Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                      No visitors yet
                    </td>
                  </tr>
                ) : (
                  visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-background-secondary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/admin/visitors/detail?id=${visitor.id}`)}
                          className="text-brand-purple hover:text-brand-purple-light font-medium cursor-pointer"
                        >
                          {visitor.ip_address}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {visitor.country || 'Unknown'}
                        {visitor.region && visitor.region !== 'Unknown' && `, ${visitor.region}`}
                        {visitor.city && visitor.city !== 'Unknown' && `, ${visitor.city}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {visitor.visit_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(visitor.first_seen_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(visitor.last_seen_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visitor.is_muted ? (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            Muted
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

