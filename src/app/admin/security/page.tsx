'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

interface AdminAccessLog {
  id: string
  visitor_id: string | null
  ip_address: string
  access_type: string
  page_path: string | null
  attempted_username: string | null
  country: string | null
  city: string | null
  region: string | null
  created_at: string
}

export default function SecurityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accessLogs, setAccessLogs] = useState<AdminAccessLog[]>([])
  const [filterType, setFilterType] = useState<string>('all')

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

    loadAccessLogs()
    trackAdminPanelAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, filterType])

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
          pagePath: '/admin/security',
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Error tracking admin panel access:', error)
    }
  }

  const loadAccessLogs = async () => {
    if (!supabase) return

    try {
      let query = supabase
        .from('admin_access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

      if (filterType !== 'all') {
        query = query.eq('access_type', filterType)
      }

      const { data, error } = await query

      if (error) throw error
      setAccessLogs(data || [])
    } catch (err: any) {
      console.error('Error loading access logs:', err)
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

  const location = (log: AdminAccessLog) => {
    const parts = [log.country, log.region && log.region !== 'Unknown' ? log.region : null, log.city && log.city !== 'Unknown' ? log.city : null]
      .filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'Unknown'
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
              Security Logs
            </h1>
            <p className="text-text-secondary">
              Monitor admin panel access attempts and security events
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-brand-purple text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              All ({accessLogs.length})
            </button>
            <button
              onClick={() => setFilterType('login_page')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'login_page'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              Login Page
            </button>
            <button
              onClick={() => setFilterType('admin_panel')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'admin_panel'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              Admin Panel
            </button>
            <button
              onClick={() => setFilterType('failed_login')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'failed_login'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              Failed Logins
            </button>
          </div>
        </div>

        {/* Access Logs Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Access Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Username
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accessLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                      No access logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-background-secondary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.visitor_id ? (
                          <Link
                            href={`/admin/visitors/detail?id=${log.visitor_id}`}
                            className="text-brand-purple hover:text-brand-purple-light font-medium"
                          >
                            {log.ip_address}
                          </Link>
                        ) : (
                          <span className="text-text-primary">{log.ip_address}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {location(log)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.access_type === 'login_page' && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Login Page
                          </span>
                        )}
                        {log.access_type === 'admin_panel' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Admin Panel
                          </span>
                        )}
                        {log.access_type === 'failed_login' && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                            Failed Login
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-primary">
                        {log.page_path || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {log.attempted_username || '-'}
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

