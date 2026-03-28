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
  visitor_number: number | null
  display_name: string | null
  is_trusted: boolean
  last_country: string | null
  last_city: string | null
  last_user_agent: string | null
  last_page_path: string | null
  last_webrtc_subnet: string | null
  last_seen_at: string
  first_seen_at: string
  visit_count: number
}

interface NetworkLink {
  id: string
  visitor_id_a: string
  visitor_id_b: string
  link_type: 'same_person' | 'different_person'
  subnet: string | null
}

interface SubnetGroup {
  subnet: string
  visitors: Visitor[]
  pairs: Array<{ a: Visitor; b: Visitor; linkKey: string }>
}

type LinkType = 'same_person' | 'different_person'

// ============================================================
// Helpers
// ============================================================

function linkKey(idA: string, idB: string): string {
  return [idA, idB].sort().join('::')
}

function normalizeIds(idA: string, idB: string): [string, string] {
  return idA < idB ? [idA, idB] : [idB, idA]
}

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
  if (m < 60) return `${m} dk`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} sa`
  return `${Math.floor(h / 24)} gün`
}

function parseBrowser(ua: string | null): string {
  if (!ua) return '—'
  const u = ua.toLowerCase()
  if (/edg\//.test(u)) return 'Edge'
  if (/chrome/.test(u) && !/chromium/.test(u)) return 'Chrome'
  if (/firefox/.test(u)) return 'Firefox'
  if (/safari/.test(u) && !/chrome/.test(u)) return 'Safari'
  return 'Browser'
}

function parseDeviceType(ua: string | null): { icon: string; label: string } {
  if (!ua) return { icon: '💻', label: 'Desktop' }
  const u = ua.toLowerCase()
  if (/ipad|tablet/.test(u)) return { icon: '📟', label: 'Tablet' }
  if (/mobile|android|iphone/.test(u)) return { icon: '📱', label: 'Mobil' }
  return { icon: '💻', label: 'Desktop' }
}

// ============================================================
// Visitor mini-card
// ============================================================

function VisitorMiniCard({ visitor }: { visitor: Visitor }) {
  const label = formatVisitorLabel(visitor)
  const device = parseDeviceType(visitor.last_user_agent)
  const browser = parseBrowser(visitor.last_user_agent)
  const location =
    [visitor.last_city, visitor.last_country].filter(Boolean).join(', ') || 'Bilinmeyen'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-base">{device.icon}</span>
        <span
          className={`text-sm font-bold ${
            visitor.is_trusted ? 'text-emerald-600' : 'text-text-primary'
          }`}
        >
          {visitor.is_trusted && '✅ '}
          {label}
        </span>
      </div>
      <div className="text-xs text-text-secondary space-y-0.5">
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{location}</span>
        </div>
        <div>{browser} · {device.label}</div>
        {visitor.last_page_path && (
          <div className="truncate text-[11px] text-gray-400 max-w-[130px]">
            {visitor.last_page_path}
          </div>
        )}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="px-1.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple font-semibold text-[10px]">
            {visitor.visit_count} ziyaret
          </span>
          <span className="text-[10px] text-gray-400">{formatRelativeTime(visitor.last_seen_at)}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Pair card — shows two visitors side by side + decision
// ============================================================

function PairCard({
  a,
  b,
  existingLink,
  onDecide,
  onUndo,
}: {
  a: Visitor
  b: Visitor
  existingLink: NetworkLink | null
  onDecide: (idA: string, idB: string, type: LinkType) => Promise<void>
  onUndo: (idA: string, idB: string) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  const decide = async (type: LinkType) => {
    setLoading(true)
    await onDecide(a.id, b.id, type)
    setLoading(false)
  }

  const undo = async () => {
    setLoading(true)
    await onUndo(a.id, b.id)
    setLoading(false)
  }

  const resolved = !!existingLink

  let borderClass = 'border-amber-200'
  let bgClass = 'bg-amber-50/40'
  let statusEl: React.ReactNode = null

  if (existingLink?.link_type === 'same_person') {
    borderClass = 'border-emerald-200'
    bgClass = 'bg-emerald-50/40'
    statusEl = (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-lg">
        <span className="text-emerald-600 text-sm font-semibold">✅ Aynı kişi</span>
        <button
          onClick={undo}
          disabled={loading}
          className="text-xs text-emerald-500 hover:text-red-500 underline transition-colors"
        >
          Geri al
        </button>
      </div>
    )
  } else if (existingLink?.link_type === 'different_person') {
    borderClass = 'border-gray-200'
    bgClass = 'bg-gray-50/60'
    statusEl = (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
        <span className="text-gray-500 text-sm font-semibold">✗ Farklı kişiler</span>
        <button
          onClick={undo}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-brand-purple underline transition-colors"
        >
          Geri al
        </button>
      </div>
    )
  }

  return (
    <div
      className={`border rounded-xl p-4 transition-all duration-300 ${borderClass} ${bgClass} ${
        resolved ? 'opacity-80' : ''
      }`}
    >
      {/* Two visitors side by side */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <VisitorMiniCard visitor={a} />
        </div>

        {/* Middle connector */}
        <div className="flex flex-col items-center justify-center pt-3 gap-1">
          <div className="w-px h-4 bg-gray-300" />
          <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="w-px h-4 bg-gray-300" />
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <VisitorMiniCard visitor={b} />
        </div>
      </div>

      {/* Decision area */}
      {resolved ? (
        <div className="flex justify-center">{statusEl}</div>
      ) : (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <p className="text-xs text-amber-700 font-medium w-full text-center mb-1">
            ⚠️ Aynı WiFi ağından — aynı kişi mi?
          </p>
          <button
            onClick={() => decide('same_person')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>✓</span>
            )}
            Aynı kişi
          </button>
          <button
            onClick={() => decide('different_person')}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            <span>✗</span>
            Farklı kişi
          </button>
          <div className="flex gap-2">
            <Link
              href={`/admin/visitors/detail?id=${a.id}`}
              className="px-2 py-1.5 text-[11px] text-brand-purple hover:underline"
            >
              {formatVisitorLabel(a)} detay
            </Link>
            <span className="text-gray-300">·</span>
            <Link
              href={`/admin/visitors/detail?id=${b.id}`}
              className="px-2 py-1.5 text-[11px] text-brand-purple hover:underline"
            >
              {formatVisitorLabel(b)} detay
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Subnet Group card
// ============================================================

function SubnetGroupCard({
  group,
  linkMap,
  onDecide,
  onUndo,
}: {
  group: SubnetGroup
  linkMap: Map<string, NetworkLink>
  onDecide: (idA: string, idB: string, type: LinkType) => Promise<void>
  onUndo: (idA: string, idB: string) => Promise<void>
}) {
  const resolvedCount = group.pairs.filter((p) => linkMap.has(p.linkKey)).length
  const unresolvedCount = group.pairs.length - resolvedCount

  const lastSeen = group.visitors
    .map((v) => new Date(v.last_seen_at).getTime())
    .sort((a, b) => b - a)[0]

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-text-primary font-mono">{group.subnet}.*</p>
            <p className="text-xs text-text-secondary">
              {group.visitors.length} ziyaretçi · Son: {formatRelativeTime(new Date(lastSeen).toISOString())}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {unresolvedCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
              {unresolvedCount} bekliyor
            </span>
          )}
          {resolvedCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
              {resolvedCount} çözüldü
            </span>
          )}
        </div>
      </div>

      {/* Pairs */}
      <div className="p-4 space-y-3">
        {group.pairs.map((pair) => (
          <PairCard
            key={pair.linkKey}
            a={pair.a}
            b={pair.b}
            existingLink={linkMap.get(pair.linkKey) ?? null}
            onDecide={onDecide}
            onUndo={onUndo}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================

export default function NetworkGroupsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<SubnetGroup[]>([])
  const [linkMap, setLinkMap] = useState<Map<string, NetworkLink>>(new Map())
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending')

  useEffect(() => {
    if (!isSupabaseAvailable()) { router.push('/admin/login'); return }
    if (typeof window === 'undefined') { router.push('/admin/login'); return }
    const stored = sessionStorage.getItem('admin_user')
    if (!stored) { router.push('/admin/login'); return }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const loadData = async () => {
    if (!supabase) return
    try {
      const [visitorsRes, linksRes] = await Promise.all([
        supabase
          .from('visitors')
          .select('id, visitor_number, display_name, is_trusted, last_country, last_city, last_user_agent, last_page_path, last_webrtc_subnet, last_seen_at, first_seen_at, visit_count')
          .not('last_webrtc_subnet', 'is', null)
          .order('last_seen_at', { ascending: false }),
        supabase
          .from('visitor_network_links')
          .select('*'),
      ])

      const visitors: Visitor[] = visitorsRes.data ?? []
      const links: NetworkLink[] = linksRes.data ?? []

      // Build link map
      const map = new Map<string, NetworkLink>()
      for (const link of links) {
        map.set(linkKey(link.visitor_id_a, link.visitor_id_b), link)
      }
      setLinkMap(map)

      // Group by subnet
      const bySubnet = new Map<string, Visitor[]>()
      for (const v of visitors) {
        if (!v.last_webrtc_subnet) continue
        const existing = bySubnet.get(v.last_webrtc_subnet) ?? []
        existing.push(v)
        bySubnet.set(v.last_webrtc_subnet, existing)
      }

      // Build groups with pairs
      const groupList: SubnetGroup[] = []
      for (const [subnet, svs] of bySubnet.entries()) {
        if (svs.length < 2) continue

        const pairs: SubnetGroup['pairs'] = []
        for (let i = 0; i < svs.length; i++) {
          for (let j = i + 1; j < svs.length; j++) {
            pairs.push({
              a: svs[i],
              b: svs[j],
              linkKey: linkKey(svs[i].id, svs[j].id),
            })
          }
        }

        // Sort: unresolved pairs first
        pairs.sort((p1, p2) => {
          const r1 = map.has(p1.linkKey) ? 1 : 0
          const r2 = map.has(p2.linkKey) ? 1 : 0
          return r1 - r2
        })

        groupList.push({ subnet, visitors: svs, pairs })
      }

      // Sort groups: more unresolved pairs first
      groupList.sort((a, b) => {
        const pendingA = a.pairs.filter((p) => !map.has(p.linkKey)).length
        const pendingB = b.pairs.filter((p) => !map.has(p.linkKey)).length
        return pendingB - pendingA
      })

      setGroups(groupList)
    } catch {}
    finally { setLoading(false) }
  }

  const handleDecide = async (idA: string, idB: string, type: LinkType) => {
    if (!supabase) return
    const [a, b] = normalizeIds(idA, idB)

    try {
      const { data, error } = await supabase
        .from('visitor_network_links')
        .upsert(
          { visitor_id_a: a, visitor_id_b: b, link_type: type, updated_at: new Date().toISOString() },
          { onConflict: 'visitor_id_a,visitor_id_b' }
        )
        .select()
        .single()

      if (error) throw error

      setLinkMap((prev) => {
        const next = new Map(prev)
        next.set(linkKey(a, b), data)
        return next
      })
    } catch {}
  }

  const handleUndo = async (idA: string, idB: string) => {
    if (!supabase) return
    const [a, b] = normalizeIds(idA, idB)
    const key = linkKey(a, b)
    const existing = linkMap.get(key)
    if (!existing) return

    try {
      await supabase.from('visitor_network_links').delete().eq('id', existing.id)
      setLinkMap((prev) => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    } catch {}
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  // Filter
  const filtered = useMemo(() => {
    if (filter === 'all') return groups
    return groups.filter((g) => {
      const pending = g.pairs.filter((p) => !linkMap.has(p.linkKey)).length
      if (filter === 'pending') return pending > 0
      if (filter === 'resolved') return pending === 0 && g.pairs.length > 0
      return true
    })
  }, [groups, linkMap, filter])

  const totalPending = useMemo(
    () => groups.reduce((sum, g) => sum + g.pairs.filter((p) => !linkMap.has(p.linkKey)).length, 0),
    [groups, linkMap]
  )
  const totalResolved = useMemo(() => linkMap.size, [linkMap])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Ağ grupları yükleniyor…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-sm text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">🌐 Ağ Grupları</h1>
            <p className="text-text-secondary mt-1">
              Aynı WiFi ağından giren ziyaretçiler — aynı kişi mi yoksa farklı mı?
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>Çıkış</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-2xl font-bold text-text-primary">{groups.length}</p>
            <p className="text-xs text-text-secondary mt-1">Ağ Grubu</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{totalPending}</p>
            <p className="text-xs text-amber-700 mt-1">Bekleyen Karar</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{totalResolved}</p>
            <p className="text-xs text-emerald-700 mt-1">Çözümlendi</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-soft mb-6 w-fit">
          {(
            [
              { key: 'pending', label: '⏳ Bekleyenler' },
              { key: 'all', label: 'Tümü' },
              { key: 'resolved', label: '✓ Çözülmüşler' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-brand-purple text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Empty states */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-16 text-center">
            <p className="text-5xl mb-4">🔒</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Henüz ağ grubu yok
            </h2>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              Aynı WiFi ağından en az 2 farklı ziyaretçi geldiğinde burada görünür.
              WebRTC yerel IP tespiti için tarayıcı desteklemeli.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
            <p className="text-text-secondary text-sm">
              Bu filtreye uygun grup bulunamadı.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((group) => (
              <SubnetGroupCard
                key={group.subnet}
                group={group}
                linkMap={linkMap}
                onDecide={handleDecide}
                onUndo={handleUndo}
              />
            ))}
          </div>
        )}

        {/* Info footer */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Nasıl çalışır?</strong> WebRTC protokolü ile tarayıcıdan yerel IP adresi
            okunur (örn. 192.168.1.x). Aynı subnet&apos;ten gelen ziyaretçiler bu panelde grup
            olarak gösterilir. Bir okul, ofis veya ev ağı gibi düşünebilirsin. Kararların
            veritabanına kaydedilir ve değiştirilebilir. WebRTC bazı tarayıcılarda devre dışı
            olabilir.
          </p>
        </div>
      </div>
    </div>
  )
}
