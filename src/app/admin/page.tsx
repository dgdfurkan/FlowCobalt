'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVisitors: 0,
    newVisitors: 0,
    returningVisitors: 0,
    totalVisits: 0,
  })

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      router.push('/admin/login')
      return
    }

    checkAuth()
    loadStats()
    
    // Track admin panel access after authentication check
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('admin_user')
      if (storedUser) {
        trackAdminPanelAccess()
      }
    }
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
          pagePath: '/admin',
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Error tracking admin panel access:', error)
    }
  }

  const checkAuth = () => {
    // Simple session check from sessionStorage
    if (typeof window === 'undefined') {
      router.push('/admin/login')
      return
    }

    const storedUser = sessionStorage.getItem('admin_user')
    if (!storedUser) {
      router.push('/admin/login')
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch (error) {
      console.error('Auth error:', error)
      sessionStorage.removeItem('admin_user')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    if (!supabase) return
    
    try {
      // Total visitors
      const { count: totalVisitors } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })

      // New visitors (first visit)
      const { count: newVisitors } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .eq('visit_count', 1)

      // Returning visitors
      const { count: returningVisitors } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .gt('visit_count', 1)

      // Total visits
      const { count: totalVisits } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalVisitors: totalVisitors || 0,
        newVisitors: newVisitors || 0,
        returningVisitors: returningVisitors || 0,
        totalVisits: totalVisits || 0,
      })
    } catch (error) {
      console.error('Stats error:', error)
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary">
              Welcome, {user?.username || 'Admin'}
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Total Visitors
            </h3>
            <p className="text-3xl font-bold text-text-primary">
              {stats.totalVisitors}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              New Visitors
            </h3>
            <p className="text-3xl font-bold text-brand-purple">
              {stats.newVisitors}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Returning Visitors
            </h3>
            <p className="text-3xl font-bold text-brand-purple-light">
              {stats.returningVisitors}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">
              Total Visits
            </h3>
            <p className="text-3xl font-bold text-text-primary">
              {stats.totalVisits}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/visitors" className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
            <h2 className="text-xl font-bold text-text-primary mb-2">
              View All Visitors
            </h2>
            <p className="text-text-secondary">
              See detailed visitor information and visit history
            </p>
          </Link>
          
          <Link href="/admin/contact-submissions" className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Contact Submissions
            </h2>
            <p className="text-text-secondary">
              View messages from the contact form
            </p>
          </Link>
          
          <Link href="/admin/security" className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow">
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Security Logs
            </h2>
            <p className="text-text-secondary">
              Monitor admin access attempts and security events
            </p>
          </Link>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Settings
          </h2>
          <p className="text-text-secondary">
            Settings panel will be implemented in the next phase.
          </p>
        </div>
      </div>
    </div>
  )
}

