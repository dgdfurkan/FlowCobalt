'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

interface Stats {
  totalVisitors: number
  trustedVisitors: number
  todayVisitors: number
  returningVisitors: number
  totalSessions: number
  totalContacts: number
}

interface RecentVisitor {
  id: string
  visitor_number: number | null
  display_name: string | null
  is_trusted: boolean
  last_country: string | null
  last_city: string | null
  last_page_path: string | null
  last_seen_at: string
  visit_count: number
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'Az önce'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} saat önce`
  const d = Math.floor(h / 24)
  return `${d} gün önce`
}

function formatVisitorLabel(v: RecentVisitor): string {
  if (v.is_trusted && v.display_name) return v.display_name
  if (v.visitor_number) return `V-${String(v.visitor_number).padStart(4, '0')}`
  return 'V-????'
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    trustedVisitors: 0,
    todayVisitors: 0,
    returningVisitors: 0,
    totalSessions: 0,
    totalContacts: 0,
  })
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([])

  useEffect(() => {
    if (!isSupabaseAvailable()) { router.push('/admin/login'); return }
    checkAuth()
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const checkAuth = () => {
    if (typeof window === 'undefined') { router.push('/admin/login'); return }
    const stored = sessionStorage.getItem('admin_user')
    if (!stored) { router.push('/admin/login'); return }
    try {
      setUser(JSON.parse(stored))
    } catch {
      sessionStorage.removeItem('admin_user')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    if (!supabase) return
    try {
      const [
        totalRes,
        trustedRes,
        returningRes,
        sessionsRes,
        contactsRes,
        recentRes,
      ] = await Promise.all([
        supabase.from('visitors').select('*', { count: 'exact', head: true }),
        supabase.from('visitors').select('*', { count: 'exact', head: true }).eq('is_trusted', true),
        supabase.from('visitors').select('*', { count: 'exact', head: true }).gt('visit_count', 1),
        supabase.from('visits').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase
          .from('visitors')
          .select('id, visitor_number, display_name, is_trusted, last_country, last_city, last_page_path, last_seen_at, visit_count')
          .order('last_seen_at', { ascending: false })
          .limit(8),
      ])

      // Count today's visitors from the recent list
      const { data: todayData } = await supabase
        .from('visitors')
        .select('id, last_seen_at')
        .order('last_seen_at', { ascending: false })
        .limit(500)

      const todayCount = (todayData ?? []).filter((v) => isToday(v.last_seen_at)).length

      setStats({
        totalVisitors: totalRes.count ?? 0,
        trustedVisitors: trustedRes.count ?? 0,
        todayVisitors: todayCount,
        returningVisitors: returningRes.count ?? 0,
        totalSessions: sessionsRes.count ?? 0,
        totalContacts: contactsRes.count ?? 0,
      })
      setRecentVisitors(recentRes.data ?? [])
    } catch {}
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: 'Toplam Ziyaretçi', value: stats.totalVisitors, color: 'text-text-primary', icon: '👥' },
    { label: 'Güvenilir Cihaz', value: stats.trustedVisitors, color: 'text-emerald-600', icon: '✅' },
    { label: 'Bugün', value: stats.todayVisitors, color: 'text-blue-600', icon: '📅' },
    { label: 'Tekrar Gelen', value: stats.returningVisitors, color: 'text-brand-purple', icon: '🔁' },
    { label: 'Toplam Oturum', value: stats.totalSessions, color: 'text-text-primary', icon: '📊' },
    { label: 'İletişim Mesajı', value: stats.totalContacts, color: 'text-orange-600', icon: '✉️' },
  ]

  const quickLinks = [
    {
      href: '/admin/visitors',
      icon: '👥',
      title: 'Ziyaretçiler',
      desc: 'Tüm ziyaretçileri kart görünümünde incele',
      badge: stats.todayVisitors > 0 ? `${stats.todayVisitors} bugün` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/admin/trusted-devices',
      icon: '✅',
      title: 'Güvenilir Cihazlar',
      desc: 'Kendi cihazlarını tanıt, Telegram bildirimlerini kişiselleştir',
      badge: stats.trustedVisitors > 0 ? `${stats.trustedVisitors} güvenilir` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      href: '/admin/contact-submissions',
      icon: '✉️',
      title: 'İletişim Mesajları',
      desc: 'İletişim formundan gelen mesajları görüntüle',
      badge: stats.totalContacts > 0 ? `${stats.totalContacts} mesaj` : undefined,
      badgeColor: 'bg-orange-100 text-orange-700',
    },
    {
      href: '/admin/network-groups',
      icon: '🌐',
      title: 'Ağ Grupları',
      desc: 'Aynı WiFi\'dan gelen ziyaretçileri karşılaştır ve karar ver',
    },
    {
      href: '/admin/security',
      icon: '🔒',
      title: 'Güvenlik Logları',
      desc: 'Admin panel erişim girişimlerini izle',
    },
  ]

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Admin Panel</h1>
            <p className="text-text-secondary mt-1">Hoş geldin, {user?.username ?? 'Admin'}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>Çıkış</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-soft p-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl shadow-soft p-6 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="text-2xl mb-3">{link.icon}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-base font-bold text-text-primary">{link.title}</h2>
                {link.badge && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${link.badgeColor}`}>
                    {link.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-auto">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent visitors */}
        {recentVisitors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Son Ziyaretçiler</h2>
                <p className="text-sm text-text-secondary mt-0.5">En son sitenizi kim ziyaret etti</p>
              </div>
              <Link
                href="/admin/visitors"
                className="text-sm text-brand-purple hover:text-brand-purple-light font-medium"
              >
                Tümünü gör →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentVisitors.map((v) => {
                const label = formatVisitorLabel(v)
                const location = [v.last_city, v.last_country].filter(Boolean).join(', ') || 'Bilinmeyen'
                return (
                  <Link
                    key={v.id}
                    href={`/admin/visitors/detail?id=${v.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {v.is_trusted ? (
                        <span className="text-lg">✅</span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-xs font-bold text-brand-purple flex-shrink-0">
                          {label.slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${v.is_trusted ? 'text-emerald-700' : 'text-text-primary'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {location}{v.last_page_path ? ` • ${v.last_page_path}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-xs text-text-secondary">{formatRelativeTime(v.last_seen_at)}</p>
                      <p className="text-xs text-brand-purple font-medium">{v.visit_count} ziyaret</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
