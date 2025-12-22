'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

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

interface Visit {
  id: string
  page_path: string
  user_agent: string | null
  referer: string | null
  is_new_visit: boolean
  created_at: string
}

interface Props {
  visitorId: string
}

export default function VisitorDetailClient({ visitorId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])

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

    loadVisitorDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, visitorId])

  const loadVisitorDetails = async () => {
    if (!supabase || !visitorId) return

    try {
      // Load visitor
      const { data: visitorData, error: visitorError } = await supabase
        .from('visitors')
        .select('*')
        .eq('id', visitorId)
        .single()

      if (visitorError) throw visitorError
      setVisitor(visitorData)

      // Load visits
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (visitsError) throw visitsError
      setVisits(visitsData || [])
    } catch (error) {
      console.error('Error loading visitor details:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMute = async () => {
    if (!supabase || !visitor) return

    try {
      const { error } = await supabase
        .from('visitors')
        .update({ is_muted: !visitor.is_muted })
        .eq('id', visitorId)

      if (error) throw error
      setVisitor({ ...visitor, is_muted: !visitor.is_muted })
    } catch (error) {
      console.error('Error toggling mute:', error)
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

  if (!visitor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Visitor not found</div>
      </div>
    )
  }

  const location = [
    visitor.country,
    visitor.region && visitor.region !== 'Unknown' ? visitor.region : null,
    visitor.city && visitor.city !== 'Unknown' ? visitor.city : null,
  ]
    .filter(Boolean)
    .join(', ') || 'Unknown'

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/visitors" className="text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Back to Visitors
            </Link>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Visitor Details
            </h1>
            <p className="text-text-secondary">
              IP: {visitor.ip_address}
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Visitor Info Card */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">IP Address</h3>
              <p className="text-lg font-semibold text-text-primary">{visitor.ip_address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Location</h3>
              <p className="text-lg font-semibold text-text-primary">{location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Total Visits</h3>
              <p className="text-lg font-semibold text-brand-purple">{visitor.visit_count}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Status</h3>
              {visitor.is_muted ? (
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded">
                  Muted
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded">
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">First Seen</h3>
              <p className="text-text-primary">
                {new Date(visitor.first_seen_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Last Seen</h3>
              <p className="text-text-primary">
                {new Date(visitor.last_seen_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              variant={visitor.is_muted ? 'primary' : 'secondary'}
              onClick={toggleMute}
            >
              {visitor.is_muted ? 'Unmute Notifications' : 'Mute Notifications'}
            </Button>
          </div>
        </div>

        {/* Visits Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-text-primary">Visit History</h2>
            <p className="text-sm text-text-secondary mt-1">
              {visits.length} recent visits
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Referer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    User Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                      No visits recorded
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-background-secondary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(visit.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {visit.page_path || '/'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                        {visit.referer || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                        {visit.user_agent || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visit.is_new_visit ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            New
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            Returning
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
