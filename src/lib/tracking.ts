import { supabase, isSupabaseAvailable } from './supabase'

// ============================================================
// Storage Keys — 4-layer: localStorage + cookie + sessionStorage
// ============================================================
const LS_DEVICE_ID = 'fc_did'
const LS_VISITOR_ID = 'fc_vid'
const LS_VISIT_ID = 'fc_vsid'
const CK_DEVICE_ID = 'fc_did'
const CK_VISITOR_ID = 'fc_vid'
const SS_LAST_VISIT = 'fc_lv'
const SS_VISITOR_ID = 'fc_visitor_id'
const SS_VISIT_ID = 'fc_visit_id'

// ============================================================
// Cookie helpers
// ============================================================

function setCookie(name: string, value: string, days = 730) {
  try {
    const exp = new Date(Date.now() + days * 86_400_000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`
  } catch {}
}

function getCookie(name: string): string | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return m ? decodeURIComponent(m[1]) : null
  } catch {
    return null
  }
}

// ============================================================
// UUID
// ============================================================

function generateUUID(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }
}

// ============================================================
// 4-layer Device ID  (localStorage → cookie → create → sync both)
// ============================================================

function getOrCreateDeviceId(): string {
  let id: string | null = null

  // 1. localStorage
  try { id = localStorage.getItem(LS_DEVICE_ID) } catch {}
  if (id) {
    setCookie(CK_DEVICE_ID, id) // keep cookie in sync
    return id
  }

  // 2. cookie (survives localStorage clear)
  id = getCookie(CK_DEVICE_ID)
  if (id) {
    try { localStorage.setItem(LS_DEVICE_ID, id) } catch {}
    return id
  }

  // 3. create new — persist in both
  const newId = generateUUID()
  try { localStorage.setItem(LS_DEVICE_ID, newId) } catch {}
  setCookie(CK_DEVICE_ID, newId)
  return newId
}

// ============================================================
// 4-layer Visitor ID  (localStorage → cookie → sessionStorage)
// ============================================================

function getStoredVisitorId(): string | null {
  let id: string | null = null
  try { id = localStorage.getItem(LS_VISITOR_ID) } catch {}
  if (id) return id
  id = getCookie(CK_VISITOR_ID)
  if (id) return id
  try { id = sessionStorage.getItem(SS_VISITOR_ID) } catch {}
  return id
}

function saveVisitorId(id: string) {
  try { localStorage.setItem(LS_VISITOR_ID, id) } catch {}
  setCookie(CK_VISITOR_ID, id)
  try { sessionStorage.setItem(SS_VISITOR_ID, id) } catch {}
}

function getStoredVisitId(): string | null {
  let id: string | null = null
  try { id = localStorage.getItem(LS_VISIT_ID) } catch {}
  if (id) return id
  try { id = sessionStorage.getItem(SS_VISIT_ID) } catch {}
  return id
}

function saveVisitId(id: string) {
  try { localStorage.setItem(LS_VISIT_ID, id) } catch {}
  try { sessionStorage.setItem(SS_VISIT_ID, id) } catch {}
}

// ============================================================
// Fingerprint signals
// ============================================================

function getCanvasHash(): string {
  try {
    const c = document.createElement('canvas')
    c.width = 280
    c.height = 60
    const ctx = c.getContext('2d')
    if (!ctx) return ''

    ctx.fillStyle = '#e91e63'
    ctx.fillRect(0, 0, 280, 60)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px Arial, Helvetica, sans-serif'
    ctx.fillText('fc_fp_v2_\u2665', 12, 38)
    ctx.fillStyle = 'rgba(0,200,100,0.7)'
    ctx.font = 'italic 11px Verdana, sans-serif'
    ctx.fillText('flowcobalt.com', 120, 52)
    ctx.fillStyle = 'rgba(0,100,255,0.5)'
    ctx.beginPath()
    ctx.arc(250, 30, 18, 0, Math.PI * 2)
    ctx.fill()

    return c.toDataURL()
  } catch {
    return ''
  }
}

async function sha256short(str: string): Promise<string> {
  try {
    const buf = new TextEncoder().encode(str)
    const hash = await crypto.subtle.digest('SHA-256', buf)
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 20)
  } catch {
    let h = 0
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i)
    }
    return Math.abs(h).toString(16).padStart(8, '0')
  }
}

async function getWebRTCLocalIP(): Promise<{ ip: string | null; subnet: string | null }> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !window.RTCPeerConnection) {
        return resolve({ ip: null, subnet: null })
      }

      const pc = new RTCPeerConnection({ iceServers: [] })
      let done = false

      const finish = (ip: string | null, subnet: string | null) => {
        if (done) return
        done = true
        try { pc.close() } catch {}
        resolve({ ip, subnet })
      }

      const t = setTimeout(() => finish(null, null), 2500)

      pc.createDataChannel('')
      pc.createOffer()
        .then((o) => pc.setLocalDescription(o))
        .catch(() => { clearTimeout(t); finish(null, null) })

      pc.onicecandidate = (ev) => {
        if (!ev?.candidate?.candidate) return
        const m = ev.candidate.candidate.match(/(?:^|\s)(\d{1,3}(?:\.\d{1,3}){3})(?:\s|$)/)
        if (!m) return
        const ip = m[1]
        const isPrivate =
          ip.startsWith('192.168.') ||
          ip.startsWith('10.') ||
          /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
        if (isPrivate) {
          clearTimeout(t)
          finish(ip, ip.split('.').slice(0, 3).join('.'))
        }
      }
    } catch {
      resolve({ ip: null, subnet: null })
    }
  })
}

interface FingerprintData {
  deviceId: string
  visitorIdHint: string | null  // ← THE KEY: stored visitor ID from previous session
  fingerprintHash: string
  canvasHash: string
  screenResolution: string
  colorDepth: string
  timezone: string
  language: string
  cpuCores: number
  deviceMemory: number | null
  webrtcLocalIp: string | null
  webrtcSubnet: string | null
  connectionType: string | null
}

async function collectFingerprint(): Promise<FingerprintData> {
  const deviceId = getOrCreateDeviceId()
  const visitorIdHint = getStoredVisitorId() // may be null on first ever visit

  const rawCanvas = typeof window !== 'undefined' ? getCanvasHash() : ''
  const canvasHash = await sha256short(rawCanvas)

  const screenResolution =
    typeof window !== 'undefined'
      ? `${window.screen.width}x${window.screen.height}`
      : ''
  const colorDepth = String(
    typeof window !== 'undefined' ? (window.screen.colorDepth ?? 24) : 24
  )
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  const language = (typeof navigator !== 'undefined' && navigator.language) || ''
  const cpuCores =
    (typeof navigator !== 'undefined' && (navigator as any).hardwareConcurrency) || 0
  const deviceMemory =
    typeof navigator !== 'undefined'
      ? ((navigator as any).deviceMemory ?? null)
      : null

  let connectionType: string | null = null
  try {
    const conn =
      (navigator as any).connection ??
      (navigator as any).mozConnection ??
      (navigator as any).webkitConnection
    connectionType = conn?.type ?? conn?.effectiveType ?? null
  } catch {}

  // WebRTC — wrapped in a race; mobile might be slow
  let webrtcLocalIp: string | null = null
  let webrtcSubnet: string | null = null
  try {
    const rtc = await getWebRTCLocalIP()
    webrtcLocalIp = rtc.ip
    webrtcSubnet = rtc.subnet
  } catch {}

  // Fingerprint only uses STABLE signals (not IP, not WebRTC, not deviceId)
  const source = [canvasHash, screenResolution, colorDepth, timezone, language, String(cpuCores)].join('|')
  const fingerprintHash = await sha256short(source)

  return {
    deviceId,
    visitorIdHint,
    fingerprintHash,
    canvasHash,
    screenResolution,
    colorDepth,
    timezone,
    language,
    cpuCores,
    deviceMemory,
    webrtcLocalIp,
    webrtcSubnet,
    connectionType,
  }
}

// ============================================================
// Tracking Event Types
// ============================================================

interface TrackingEvent {
  eventType: 'pageview' | 'click' | 'form_submit' | 'scroll'
  eventName?: string
  pagePath?: string
  elementId?: string
  elementClass?: string
  metadata?: Record<string, unknown>
}

// ============================================================
// TrackingService singleton
// ============================================================

class TrackingService {
  private visitorId: string | null = null
  private visitId: string | null = null
  private isInitialized = false
  private currentPagePath = ''
  private scrollMilestones: Set<number> = new Set()
  private maxScrollDepth = 0
  private scrollUnsubscribe: (() => void) | null = null

  constructor() {
    this.init()
  }

  private async init() {
    if (!isSupabaseAvailable()) return
    if (typeof window === 'undefined') return

    try {
      const lastVisitStr = sessionStorage.getItem(SS_LAST_VISIT)
      const now = Date.now()
      const isNewSession = !lastVisitStr || now - parseInt(lastVisitStr) > 30_000

      if (isNewSession) {
        const fp = await collectFingerprint()
        await this.startSession(fp)
        sessionStorage.setItem(SS_LAST_VISIT, String(now))
      } else {
        // Restore IDs from multi-layer storage
        this.visitorId = getStoredVisitorId()
        this.visitId = getStoredVisitId()
      }

      this.initScrollTracking()
      this.isInitialized = true
    } catch {
      // Never crash the app
    }
  }

  private async startSession(fp: FingerprintData) {
    if (!isSupabaseAvailable()) return

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      const res = await fetch(`${supabaseUrl}/functions/v1/track-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          pagePath: window.location.pathname,
          userAgent: navigator.userAgent,
          referer: document.referrer || null,
          deviceId: fp.deviceId,
          visitorIdHint: fp.visitorIdHint,   // ← first-priority lookup
          fingerprintHash: fp.fingerprintHash,
          canvasHash: fp.canvasHash,
          screenResolution: fp.screenResolution,
          colorDepth: fp.colorDepth,
          timezone: fp.timezone,
          language: fp.language,
          cpuCores: fp.cpuCores,
          deviceMemory: fp.deviceMemory,
          webrtcLocalIp: fp.webrtcLocalIp,
          webrtcSubnet: fp.webrtcSubnet,
          connectionType: fp.connectionType,
        }),
      })

      if (res.ok) {
        const data = await res.json()

        this.visitorId = data.visitorId ?? null
        this.visitId = data.visitId ?? null

        // Persist in ALL storage layers
        if (this.visitorId) saveVisitorId(this.visitorId)
        if (this.visitId) saveVisitId(this.visitId)

        // Also update deviceId association in storage (edge function may have
        // found the visitor by a different signal — ensure deviceId is now synced)
        if (fp.deviceId) {
          try { localStorage.setItem(LS_DEVICE_ID, fp.deviceId) } catch {}
          setCookie(CK_DEVICE_ID, fp.deviceId)
        }
      }
    } catch {}
  }

  private initScrollTracking() {
    if (typeof window === 'undefined') return

    this.currentPagePath = window.location.pathname
    this.scrollMilestones.clear()
    this.maxScrollDepth = 0

    const onScroll = () => {
      try {
        const top = window.pageYOffset || document.documentElement.scrollTop
        const height = document.documentElement.scrollHeight - window.innerHeight
        const pct = height > 0 ? Math.round((top / height) * 100) : 0

        if (pct > this.maxScrollDepth) this.maxScrollDepth = pct

        for (const m of [25, 50, 75, 100]) {
          if (pct >= m && !this.scrollMilestones.has(m)) {
            this.scrollMilestones.add(m)
            this.trackEvent({
              eventType: 'scroll',
              eventName: `scroll_${m}`,
              metadata: { milestone: m, maxDepth: this.maxScrollDepth },
            })
          }
        }
      } catch {}
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    const throttled = () => {
      if (timer) return
      timer = setTimeout(() => { onScroll(); timer = null }, 100)
    }

    window.addEventListener('scroll', throttled, { passive: true })
    this.scrollUnsubscribe = () => window.removeEventListener('scroll', throttled)
    onScroll()
  }

  updatePagePath(newPath: string) {
    if (newPath === this.currentPagePath) return

    this.saveScrollData()
    this.currentPagePath = newPath
    this.scrollMilestones.clear()
    this.maxScrollDepth = 0

    if (this.isInitialized) {
      this.trackEvent({ eventType: 'pageview', pagePath: newPath })
    }
  }

  private async saveScrollData() {
    if (!this.visitId || this.maxScrollDepth === 0) return
    if (!isSupabaseAvailable() || !supabase) return

    try {
      await supabase
        .from('visits')
        .update({
          scroll_depth: this.maxScrollDepth,
          scroll_events: Array.from(this.scrollMilestones),
        })
        .eq('id', this.visitId)
    } catch {}
  }

  async trackEvent(event: TrackingEvent) {
    if (!isSupabaseAvailable() || !this.isInitialized || !supabase) return

    try {
      await supabase.from('events').insert({
        visit_id: this.visitId,
        visitor_id: this.visitorId,
        event_type: event.eventType,
        event_name: event.eventName ?? null,
        page_path:
          event.pagePath ??
          (typeof window !== 'undefined' ? window.location.pathname : null),
        element_id: event.elementId ?? null,
        element_class: event.elementClass ?? null,
        metadata: event.metadata ?? {},
      })
    } catch {}
  }

  trackPageView(pagePath?: string) {
    this.trackEvent({
      eventType: 'pageview',
      pagePath:
        pagePath ??
        (typeof window !== 'undefined' ? window.location.pathname : undefined),
    })
  }

  trackClick(elementId: string, elementClass?: string, eventName?: string) {
    this.trackEvent({ eventType: 'click', eventName, elementId, elementClass })
  }

  cleanup() {
    if (this.scrollUnsubscribe) {
      this.scrollUnsubscribe()
      this.scrollUnsubscribe = null
    }
    this.saveScrollData()
  }
}

// ============================================================
// Singleton export
// ============================================================

let instance: TrackingService | null = null

export const getTrackingService = (): TrackingService => {
  if (!instance) instance = new TrackingService()
  return instance
}

export const useTracking = () => getTrackingService()
