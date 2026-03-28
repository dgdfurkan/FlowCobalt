'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

// ============================================================
// Types
// ============================================================

interface Visitor {
  id: string
  device_id: string | null
  fingerprint_hash: string | null
  visitor_number: number | null
  display_name: string | null
  is_trusted: boolean
  is_muted: boolean
  match_confidence: string | null
  ip_address: string | null
  last_country: string | null
  last_city: string | null
  last_region: string | null
  last_user_agent: string | null
  last_page_path: string | null
  last_connection_type: string | null
  last_screen_resolution: string | null
  last_webrtc_subnet: string | null
  visit_count: number
  first_seen_at: string
  last_seen_at: string
}

type FilterTab = 'all' | 'trusted' | 'today' | 'returning' | 'muted'

// ============================================================
// Helpers
// ============================================================

function formatVisitorLabel(v: Visitor): string {
  if (v.is_trusted && v.display_name) return v.display_name
  if (v.visitor_number) return `V-${String(v.visitor_number).padStart(4, '0')}`
  return 'V-????'
}

function formatLocation(country: string | null, city: string | null): string {
  const parts = [city, country].filter((p) => p && p !== 'Unknown')
  return parts.length > 0 ? parts.join(', ') : 'Bilinmeyen'
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
  if (d < 30) return `${d} gün önce`
  return new Date(dateStr).toLocaleDateString('tr-TR')
}

function parseDeviceType(ua: string | null): 'Mobile' | 'Tablet' | 'Desktop' {
  if (!ua) return 'Desktop'
  const u = ua.toLowerCase()
  if (/ipad|tablet/.test(u)) return 'Tablet'
  if (/mobile|android|iphone/.test(u)) return 'Mobile'
  return 'Desktop'
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

// ============================================================
// Sub-components
// ============================================================

const DeviceIcon = ({ type }: { type: 'Mobile' | 'Tablet' | 'Desktop' }) => {
  if (type === 'Mobile') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }
  if (type === 'Tablet') {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function VisitorCard({ visitor }: { visitor: Visitor }) {
  const label = formatVisitorLabel(visitor)
  const location = formatLocation(visitor.last_country, visitor.last_city)
  const relTime = formatRelativeTime(visitor.last_seen_at)
  const deviceType = parseDeviceType(visitor.last_user_agent)
  const isNew = visitor.visit_count === 1

  let cardBorder = 'border-gray-100'
  let badgeEl: React.ReactNode = null

  if (visitor.is_trusted) {
    cardBorder = 'border-l-4 border-l-emerald-400 border-r border-t border-b border-gray-100'
    badgeEl = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
        ✅ Güvenilir
      </span>
    )
  } else if (visitor.is_muted) {
    cardBorder = 'border-gray-200'
    badgeEl = (
      <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full">
        Sessiz
      </span>
    )
  } else if (visitor.match_confidence === 'network') {
    cardBorder = 'border-l-4 border-l-amber-400 border-r border-t border-b border-gray-100'
    badgeEl = (
      <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full">
        ⚠️ Olası Eşleşme
      </span>
    )
  } else if (isNew && isToday(visitor.first_seen_at)) {
    badgeEl = (
      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
        🆕 Yeni
      </span>
    )
  }

  const hasSubnet = !!visitor.last_webrtc_subnet

  return (
    <Link href={`/admin/visitors/detail?id=${visitor.id}`}>
      <div
        className={`bg-white rounded-xl border ${cardBorder} p-5 hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className={`text-lg font-bold ${visitor.is_trusted ? 'text-emerald-700' : 'text-text-primary'}`}>
              {label}
            </p>
            <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
              <DeviceIcon type={deviceType} />
              <span>{deviceType}</span>
            </p>
          </div>
          {badgeEl && <div>{badgeEl}</div>}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-text-secondary mb-2">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>

        {/* Last page */}
        {visitor.last_page_path && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3 truncate">
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="truncate">{visitor.last_page_path}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between text-xs text-text-secondary border-t border-gray-50 pt-3">
          <span className="font-semibold text-brand-purple">
            {visitor.visit_count} ziyaret
          </span>
          <div className="flex items-center gap-1.5">
            {hasSubnet && (
              <span title={`WiFi: ${visitor.last_webrtc_subnet}.*`} className="text-blue-400">
                🌐
              </span>
            )}
            <span>{relTime}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ============================================================
// Main Page
// ============================================================

export default function VisitorsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  useEffect(() => {
    if (!isSupabaseAvailable()) { router.push('/admin/login'); return }
    if (typeof window === 'undefined') { router.push('/admin/login'); return }
    const storedUser = sessionStorage.getItem('admin_user')
    if (!storedUser) { router.push('/admin/login'); return }
    loadVisitors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadVisitors = async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('last_seen_at', { ascending: false })
        .limit(300)
      if (error) throw error
      setVisitors(data ?? [])
    } catch {
      // Silent — user will see empty state
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  const filtered = useMemo(() => {
    let list = visitors

    if (activeTab === 'trusted') list = list.filter((v) => v.is_trusted)
    else if (activeTab === 'today') list = list.filter((v) => isToday(v.last_seen_at))
    else if (activeTab === 'returning') list = list.filter((v) => v.visit_count > 1)
    else if (activeTab === 'muted') list = list.filter((v) => v.is_muted)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (v) =>
          (v.display_name && v.display_name.toLowerCase().includes(q)) ||
          (v.visitor_number && `v-${String(v.visitor_number).padStart(4, '0')}`.includes(q)) ||
          (v.last_country && v.last_country.toLowerCase().includes(q)) ||
          (v.last_city && v.last_city.toLowerCase().includes(q)) ||
          (v.ip_address && v.ip_address.includes(q))
      )
    }

    return list
  }, [visitors, activeTab, search])

  // Summary counts
  const stats = useMemo(() => ({
    total: visitors.length,
    trusted: visitors.filter((v) => v.is_trusted).length,
    today: visitors.filter((v) => isToday(v.last_seen_at)).length,
    returning: visitors.filter((v) => v.visit_count > 1).length,
  }), [visitors])

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'Tümü', count: stats.total },
    { key: 'trusted', label: '✅ Güvenilir', count: stats.trusted },
    { key: 'today', label: 'Bugün', count: stats.today },
    { key: 'returning', label: 'Tekrar Gelen', count: stats.returning },
    { key: 'muted', label: 'Sessiz' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-text-secondary text-sm">Yükleniyor…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-sm text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">Ziyaretçiler</h1>
            <p className="text-text-secondary mt-1">
              {stats.total} benzersiz ziyaretçi • {stats.today} bugün
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/network-groups"
              className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              🌐 Ağ Grupları
            </Link>
            <Link
              href="/admin/trusted-devices"
              className="px-4 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              ✅ Güvenilir Cihazlar
            </Link>
            <Button variant="secondary" onClick={handleLogout}>
              Çıkış
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Toplam Ziyaretçi', value: stats.total, color: 'text-text-primary' },
            { label: 'Güvenilir', value: stats.trusted, color: 'text-emerald-600' },
            { label: 'Bugün', value: stats.today, color: 'text-blue-600' },
            { label: 'Tekrar Gelen', value: stats.returning, color: 'text-brand-purple' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-soft p-4">
              <p className="text-xs text-text-secondary mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs + search */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-soft flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-brand-purple text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-secondary'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Ara (isim, şehir, IP…)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 w-56"
            />
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-text-secondary">
              {search ? 'Arama ile eşleşen ziyaretçi bulunamadı.' : 'Bu filtreye uygun ziyaretçi yok.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((v) => (
              <VisitorCard key={v.id} visitor={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
