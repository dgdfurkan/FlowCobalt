'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

interface Visit {
  id: string
  page_path: string | null
  user_agent: string | null
  referer: string | null
  is_new_visit: boolean
  scroll_depth: number | null
  scroll_events: number[] | null
  country: string | null
  city: string | null
  ip_address: string | null
  created_at: string
}

interface PageViewEvent {
  id: string
  page_path: string | null
  created_at: string
}

interface VisitorIp {
  id: string
  ip_address: string
  country: string | null
  city: string | null
  region: string | null
  first_seen_at: string
  last_seen_at: string
}

// ============================================================
// Helpers
// ============================================================

function formatVisitorLabel(v: Visitor): string {
  if (v.is_trusted && v.display_name) return v.display_name
  if (v.visitor_number) return `V-${String(v.visitor_number).padStart(4, '0')}`
  return 'V-????'
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
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function parseBrowser(ua: string | null): string {
  if (!ua) return 'Bilinmeyen'
  const u = ua.toLowerCase()
  if (/edg\//.test(u)) return 'Edge'
  if (/chrome/.test(u) && !/chromium/.test(u)) return 'Chrome'
  if (/firefox/.test(u)) return 'Firefox'
  if (/safari/.test(u) && !/chrome/.test(u)) return 'Safari'
  return 'Diğer'
}

function parseOS(ua: string | null): string {
  if (!ua) return 'Bilinmeyen'
  const u = ua.toLowerCase()
  if (/windows nt/.test(u)) return 'Windows'
  if (/macintosh|mac os x/.test(u)) return 'macOS'
  if (/android/.test(u)) return 'Android'
  if (/iphone|ipad/.test(u)) return 'iOS'
  if (/linux/.test(u)) return 'Linux'
  return 'Bilinmeyen'
}

function parseDeviceType(ua: string | null): string {
  if (!ua) return 'Desktop'
  const u = ua.toLowerCase()
  if (/ipad|tablet/.test(u)) return 'Tablet'
  if (/mobile|android|iphone/.test(u)) return 'Mobile'
  return 'Desktop'
}

// ============================================================
// Session row component (collapsible)
// ============================================================

function SessionRow({ visit }: { visit: Visit & { pageViews?: PageViewEvent[] } }) {
  const [open, setOpen] = useState(false)
  const [pageViews, setPageViews] = useState<PageViewEvent[]>(visit.pageViews ?? [])
  const [loading, setLoading] = useState(false)

  const loadPageViews = async () => {
    if (pageViews.length > 0) { setOpen(!open); return }
    if (!supabase) return

    setLoading(true)
    try {
      const { data } = await supabase
        .from('events')
        .select('id, page_path, created_at')
        .eq('visit_id', visit.id)
        .eq('event_type', 'pageview')
        .order('created_at', { ascending: true })
        .limit(50)
      setPageViews(data ?? [])
    } catch {}
    setLoading(false)
    setOpen(true)
  }

  const location = [visit.city, visit.country].filter((p) => p && p !== 'Unknown').join(', ') || '—'
  const browser = parseBrowser(visit.user_agent)
  const os = parseOS(visit.user_agent)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={loadPageViews}
        className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0 bg-brand-purple" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {visit.page_path || '/'}
            </p>
            <p className="text-xs text-text-secondary">
              {new Date(visit.created_at).toLocaleString('tr-TR')} • {location} • {browser}/{os}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {visit.is_new_visit ? (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Yeni</span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Tekrar</span>
          )}
          {visit.scroll_depth != null && (
            <span className="text-xs text-text-secondary hidden sm:block">
              %{visit.scroll_depth} scroll
            </span>
          )}
          {loading ? (
            <div className="w-4 h-4 border border-brand-purple border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
          {pageViews.length === 0 ? (
            <p className="text-xs text-text-secondary py-2">Bu oturumda ek sayfa görüntülenmedi.</p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Ziyaret edilen sayfalar
              </p>
              {pageViews.map((pv, idx) => (
                <div key={pv.id} className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-mono text-[10px] flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-text-primary truncate">{pv.page_path || '/'}</span>
                  <span className="ml-auto flex-shrink-0">
                    {new Date(pv.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Main Detail Content
// ============================================================

function VisitorDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const visitorId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [ips, setIps] = useState<VisitorIp[]>([])
  const [editName, setEditName] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    if (!isSupabaseAvailable()) { router.push('/admin/login'); return }
    if (typeof window === 'undefined') { router.push('/admin/login'); return }
    const storedUser = sessionStorage.getItem('admin_user')
    if (!storedUser) { router.push('/admin/login'); return }
    if (visitorId) loadAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, visitorId])

  const loadAll = async () => {
    if (!supabase || !visitorId) return
    try {
      const [visitorRes, visitsRes, ipsRes] = await Promise.all([
        supabase.from('visitors').select('*').eq('id', visitorId).single(),
        supabase
          .from('visits')
          .select('*')
          .eq('visitor_id', visitorId)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('visitor_ips')
          .select('*')
          .eq('visitor_id', visitorId)
          .order('last_seen_at', { ascending: false }),
      ])

      if (visitorRes.error) throw visitorRes.error
      setVisitor(visitorRes.data)
      setEditName(visitorRes.data?.display_name ?? '')
      setVisits(visitsRes.data ?? [])
      setIps(ipsRes.data ?? [])
    } catch {}
    finally { setLoading(false) }
  }

  const handleToggleTrust = async () => {
    if (!supabase || !visitor || !visitorId) return
    const newTrust = !visitor.is_trusted
    try {
      const updateData: Record<string, unknown> = { is_trusted: newTrust }
      if (!newTrust) updateData.display_name = null

      const { data, error } = await supabase
        .from('visitors')
        .update(updateData)
        .eq('id', visitorId)
        .select()
        .single()
      if (error) throw error
      setVisitor(data)
      setEditName(data?.display_name ?? '')
      if (!newTrust) setShowNameInput(false)
    } catch {}
  }

  const handleSaveName = async () => {
    if (!supabase || !visitor || !visitorId || !editName.trim()) return
    setNameSaving(true)
    try {
      const { data, error } = await supabase
        .from('visitors')
        .update({ display_name: editName.trim(), is_trusted: true })
        .eq('id', visitorId)
        .select()
        .single()
      if (error) throw error
      setVisitor(data)
      setShowNameInput(false)
    } catch {}
    setNameSaving(false)
  }

  const handleToggleMute = async () => {
    if (!supabase || !visitor || !visitorId) return
    try {
      const { data, error } = await supabase
        .from('visitors')
        .update({ is_muted: !visitor.is_muted })
        .eq('id', visitorId)
        .select()
        .single()
      if (error) throw error
      setVisitor(data)
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

  if (!visitor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Ziyaretçi bulunamadı.</p>
      </div>
    )
  }

  const label = formatVisitorLabel(visitor)
  const browser = parseBrowser(visitor.last_user_agent)
  const os = parseOS(visitor.last_user_agent)
  const deviceType = parseDeviceType(visitor.last_user_agent)
  const location = [visitor.last_city, visitor.last_country]
    .filter((p) => p && p !== 'Unknown').join(', ') || 'Bilinmeyen'

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <Link href="/admin/visitors" className="text-sm text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Ziyaretçiler
            </Link>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              {visitor.is_trusted && (
                <span className="text-2xl">✅</span>
              )}
              {label}
            </h1>
            <p className="text-text-secondary mt-1">
              Son görüldü: {formatRelativeTime(visitor.last_seen_at)}
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>Çıkış</Button>
        </div>

        {/* Identity Card */}
        <div className={`bg-white rounded-2xl shadow-soft p-6 mb-6 border-l-4 ${visitor.is_trusted ? 'border-l-emerald-400' : 'border-l-brand-purple'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Kimlik</p>
              <p className="text-sm font-bold text-text-primary">{label}</p>
              {visitor.visitor_number && (
                <p className="text-xs text-text-secondary">#{visitor.visitor_number}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Konum</p>
              <p className="text-sm font-semibold text-text-primary">{location}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Toplam Ziyaret</p>
              <p className="text-sm font-bold text-brand-purple">{visitor.visit_count}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary mb-1">Cihaz</p>
              <p className="text-sm font-semibold text-text-primary">{deviceType}</p>
              <p className="text-xs text-text-secondary">{browser} / {os}</p>
            </div>
          </div>

          {/* Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-100">
            {visitor.last_screen_resolution && (
              <div>
                <p className="text-xs text-text-secondary">Ekran</p>
                <p className="text-xs font-mono text-text-primary">{visitor.last_screen_resolution}</p>
              </div>
            )}
            {visitor.last_connection_type && (
              <div>
                <p className="text-xs text-text-secondary">Bağlantı</p>
                <p className="text-xs font-mono text-text-primary capitalize">{visitor.last_connection_type}</p>
              </div>
            )}
            {visitor.last_webrtc_subnet && (
              <div>
                <p className="text-xs text-text-secondary">WiFi Subnet</p>
                <p className="text-xs font-mono text-text-primary">{visitor.last_webrtc_subnet}.*</p>
              </div>
            )}
            {visitor.device_id && (
              <div>
                <p className="text-xs text-text-secondary">Cihaz ID</p>
                <p className="text-xs font-mono text-text-primary truncate">{visitor.device_id.slice(0, 18)}…</p>
              </div>
            )}
            {visitor.fingerprint_hash && (
              <div>
                <p className="text-xs text-text-secondary">Parmak İzi</p>
                <p className="text-xs font-mono text-text-primary">{visitor.fingerprint_hash}</p>
              </div>
            )}
            {visitor.match_confidence && (
              <div>
                <p className="text-xs text-text-secondary">Eşleşme</p>
                <p className="text-xs font-mono text-text-primary capitalize">{visitor.match_confidence}</p>
              </div>
            )}
          </div>

          {/* Trust management */}
          {showNameInput ? (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="İsim girin (örn. Furkan)"
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName() }}
                autoFocus
              />
              <Button variant="primary" onClick={handleSaveName} disabled={nameSaving}>
                {nameSaving ? 'Kaydediliyor…' : 'Kaydet'}
              </Button>
              <Button variant="secondary" onClick={() => setShowNameInput(false)}>
                İptal
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {visitor.is_trusted ? (
                <>
                  <button
                    onClick={() => setShowNameInput(true)}
                    className="px-4 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    ✏️ İsmi Düzenle
                  </button>
                  <button
                    onClick={handleToggleTrust}
                    className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Güveni Kaldır
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowNameInput(true)}
                  className="px-4 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  ✅ Güvenilir Yap
                </button>
              )}
              <button
                onClick={handleToggleMute}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  visitor.is_muted
                    ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                }`}
              >
                {visitor.is_muted ? '🔔 Bildirimleri Aç' : '🔕 Sessiz'}
              </button>
            </div>
          )}
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-text-primary">Oturumlar</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {visits.length} oturum • Tıklayarak sayfa geçmişini görebilirsiniz
            </p>
          </div>
          <div className="divide-y divide-gray-50 p-4 space-y-2">
            {visits.length === 0 ? (
              <p className="text-center text-text-secondary py-8 text-sm">Oturum kaydı bulunamadı.</p>
            ) : (
              visits.map((visit) => <SessionRow key={visit.id} visit={visit} />)
            )}
          </div>
        </div>

        {/* IP History */}
        {ips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-text-primary">IP Geçmişi</h2>
              <p className="text-sm text-text-secondary mt-0.5">{ips.length} farklı IP</p>
            </div>
            <div className="divide-y divide-gray-50">
              {ips.map((ip) => (
                <div key={ip.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono font-medium text-text-primary">{ip.ip_address}</p>
                    <p className="text-xs text-text-secondary">
                      {[ip.city, ip.country].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">İlk: {new Date(ip.first_seen_at).toLocaleDateString('tr-TR')}</p>
                    <p className="text-xs text-text-secondary">Son: {formatRelativeTime(ip.last_seen_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline footer */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-4">
            <p className="text-xs text-text-secondary mb-1">İlk Ziyaret</p>
            <p className="text-sm font-semibold text-text-primary">
              {new Date(visitor.first_seen_at).toLocaleString('tr-TR')}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4">
            <p className="text-xs text-text-secondary mb-1">Son Ziyaret</p>
            <p className="text-sm font-semibold text-text-primary">
              {new Date(visitor.last_seen_at).toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Export with Suspense
// ============================================================

export default function VisitorDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VisitorDetailContent />
    </Suspense>
  )
}
