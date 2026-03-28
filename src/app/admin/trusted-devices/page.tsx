'use client'

import { useEffect, useState } from 'react'
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
  last_country: string | null
  last_city: string | null
  last_user_agent: string | null
  last_page_path: string | null
  last_screen_resolution: string | null
  ip_address: string | null
  visit_count: number
  first_seen_at: string
  last_seen_at: string
}

// ============================================================
// Helpers
// ============================================================

const DEVICE_ID_KEY = 'fc_device_id'

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
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function parseBrowser(ua: string | null): string {
  if (!ua) return '—'
  const u = ua.toLowerCase()
  if (/edg\//.test(u)) return 'Edge'
  if (/chrome/.test(u) && !/chromium/.test(u)) return 'Chrome'
  if (/firefox/.test(u)) return 'Firefox'
  if (/safari/.test(u) && !/chrome/.test(u)) return 'Safari'
  return 'Tarayıcı'
}

function parseDeviceType(ua: string | null): string {
  if (!ua) return 'Desktop'
  const u = ua.toLowerCase()
  if (/ipad|tablet/.test(u)) return 'Tablet 📟'
  if (/mobile|android|iphone/.test(u)) return 'Mobil 📱'
  return 'Masaüstü 💻'
}

// ============================================================
// Naming modal
// ============================================================

function NameModal({
  visitor,
  onSave,
  onClose,
}: {
  visitor: Visitor
  onSave: (name: string) => Promise<void>
  onClose: () => void
}) {
  const [name, setName] = useState(visitor.display_name ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onSave(name.trim())
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-text-primary mb-2">
          {visitor.is_trusted ? 'İsmi Düzenle' : 'Güvenilir Yap'}
        </h2>
        <p className="text-sm text-text-secondary mb-5">
          Bu ziyaretçi için bir isim girin. Telegram bildirimlerinde bu isim kullanılacak.
        </p>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="örn. Furkan, Erdem…"
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 mb-4"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
        />
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? 'Kaydediliyor…' : '✅ Güvenilir Olarak Kaydet'}
          </Button>
          <Button variant="secondary" onClick={onClose}>İptal</Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================

export default function TrustedDevicesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [myVisitor, setMyVisitor] = useState<Visitor | null>(null)
  const [myDeviceId, setMyDeviceId] = useState<string | null>(null)
  const [trustedVisitors, setTrustedVisitors] = useState<Visitor[]>([])
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([])
  const [modalTarget, setModalTarget] = useState<Visitor | null>(null)
  const [search, setSearch] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseAvailable()) { router.push('/admin/login'); return }
    if (typeof window === 'undefined') { router.push('/admin/login'); return }
    const storedUser = sessionStorage.getItem('admin_user')
    if (!storedUser) { router.push('/admin/login'); return }

    // Read this device's ID from localStorage
    const deviceId = localStorage.getItem(DEVICE_ID_KEY)
    setMyDeviceId(deviceId)

    loadData(deviceId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadData = async (deviceId: string | null) => {
    if (!supabase) return
    try {
      const [trustedRes, allRes] = await Promise.all([
        supabase
          .from('visitors')
          .select('*')
          .eq('is_trusted', true)
          .order('last_seen_at', { ascending: false }),
        supabase
          .from('visitors')
          .select('*')
          .eq('is_trusted', false)
          .order('last_seen_at', { ascending: false })
          .limit(100),
      ])

      setTrustedVisitors(trustedRes.data ?? [])
      setAllVisitors(allRes.data ?? [])

      // Find my device in visitors
      if (deviceId) {
        const allData = [...(trustedRes.data ?? []), ...(allRes.data ?? [])]
        const mine = allData.find((v) => v.device_id === deviceId)
        setMyVisitor(mine ?? null)
      }
    } catch {}
    finally { setLoading(false) }
  }

  const handleSaveTrust = async (visitor: Visitor, name: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('visitors')
        .update({ is_trusted: true, display_name: name })
        .eq('id', visitor.id)
        .select()
        .single()
      if (error) throw error

      setModalTarget(null)

      // Refresh
      const deviceId = localStorage.getItem(DEVICE_ID_KEY)
      await loadData(deviceId)
    } catch {}
  }

  const handleRemoveTrust = async (visitorId: string) => {
    if (!supabase) return
    setRemovingId(visitorId)
    try {
      await supabase
        .from('visitors')
        .update({ is_trusted: false, display_name: null })
        .eq('id', visitorId)

      const deviceId = localStorage.getItem(DEVICE_ID_KEY)
      await loadData(deviceId)
    } catch {}
    setRemovingId(null)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  const filteredAll = allVisitors.filter((v) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (v.last_country && v.last_country.toLowerCase().includes(q)) ||
      (v.last_city && v.last_city.toLowerCase().includes(q)) ||
      (v.ip_address && v.ip_address.includes(q)) ||
      (v.visitor_number && `v-${String(v.visitor_number).padStart(4, '0')}`.includes(q))
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      {modalTarget && (
        <NameModal
          visitor={modalTarget}
          onSave={(name) => handleSaveTrust(modalTarget, name)}
          onClose={() => setModalTarget(null)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-sm text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">✅ Güvenilir Cihazlar</h1>
            <p className="text-text-secondary mt-1">
              Telegram bildirimlerinde isimle gösterilecek cihazları yönet
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>Çıkış</Button>
        </div>

        {/* ─── My Device ─── */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Bu Cihaz</h2>
          {!myDeviceId ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700">
              Bu cihaza ait kayıt bulunamadı. Önce siteyi ziyaret etmeniz gerekiyor.
            </div>
          ) : !myVisitor ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700">
              Bu cihaz veritabanında henüz kayıtlı değil. Siteyi ziyaret edince otomatik kaydolur.
            </div>
          ) : (
            <div className={`bg-white rounded-2xl shadow-soft p-6 border-l-4 ${myVisitor.is_trusted ? 'border-l-emerald-400' : 'border-l-gray-300'}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {myVisitor.is_trusted && <span className="text-lg">✅</span>}
                    <span className="text-xl font-bold text-text-primary">
                      {formatVisitorLabel(myVisitor)}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-brand-purple/10 text-brand-purple rounded-full">
                      Bu cihaz
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {[myVisitor.last_city, myVisitor.last_country].filter(Boolean).join(', ')} •{' '}
                    {parseDeviceType(myVisitor.last_user_agent)} •{' '}
                    {parseBrowser(myVisitor.last_user_agent)}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Son görüldü: {formatRelativeTime(myVisitor.last_seen_at)}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {myVisitor.is_trusted ? (
                    <>
                      <button
                        onClick={() => setModalTarget(myVisitor)}
                        className="px-4 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        ✏️ İsmi Düzenle
                      </button>
                      <button
                        onClick={() => handleRemoveTrust(myVisitor.id)}
                        disabled={removingId === myVisitor.id}
                        className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Güveni Kaldır
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setModalTarget(myVisitor)}
                      className="px-4 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      ✅ Güvenilir Yap
                    </button>
                  )}
                  <Link
                    href={`/admin/visitors/detail?id=${myVisitor.id}`}
                    className="px-4 py-2 text-sm font-medium bg-gray-50 text-gray-600 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Detay →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Trusted Visitors List ─── */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Güvenilir Listesi ({trustedVisitors.length})
          </h2>

          {trustedVisitors.length === 0 ? (
            <div className="bg-white rounded-xl shadow-soft p-10 text-center">
              <p className="text-3xl mb-3">🔒</p>
              <p className="text-text-secondary text-sm">Henüz güvenilir cihaz eklenmedi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trustedVisitors.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-l-4 border-l-emerald-400 border-r-gray-100 border-t-gray-100 border-b-gray-100 shadow-soft p-5 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg">✅</span>
                    <div className="min-w-0">
                      <p className="font-bold text-emerald-700">
                        {v.display_name ?? formatVisitorLabel(v)}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {[v.last_city, v.last_country].filter(Boolean).join(', ')} •{' '}
                        {parseDeviceType(v.last_user_agent)} •{' '}
                        {parseBrowser(v.last_user_agent)} •{' '}
                        Son: {formatRelativeTime(v.last_seen_at)}
                      </p>
                    </div>
                    {v.device_id === myDeviceId && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-brand-purple/10 text-brand-purple rounded-full flex-shrink-0">
                        Bu cihaz
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/visitors/detail?id=${v.id}`}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Detay
                    </Link>
                    <button
                      onClick={() => setModalTarget(v)}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      ✏️ Yeniden Adlandır
                    </button>
                    <button
                      onClick={() => handleRemoveTrust(v.id)}
                      disabled={removingId === v.id}
                      className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {removingId === v.id ? '…' : 'Kaldır'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── All Visitors (add trust) ─── */}
        <div>
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              Diğer Ziyaretçiler ({allVisitors.length})
            </h2>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ara…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 w-48"
              />
            </div>
          </div>

          {filteredAll.length === 0 ? (
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              <p className="text-text-secondary text-sm">Ziyaretçi bulunamadı.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="divide-y divide-gray-50">
                {filteredAll.map((v) => (
                  <div key={v.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {formatVisitorLabel(v)}
                        {v.device_id === myDeviceId && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-brand-purple/10 text-brand-purple rounded-full">
                            Bu cihaz
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {[v.last_city, v.last_country].filter(Boolean).join(', ')} •{' '}
                        {v.visit_count} ziyaret •{' '}
                        {formatRelativeTime(v.last_seen_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalTarget(v)}
                        className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        ✅ Güvenilir Yap
                      </button>
                      <Link
                        href={`/admin/visitors/detail?id=${v.id}`}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Detay
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
