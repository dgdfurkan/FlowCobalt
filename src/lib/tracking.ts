import { supabase, isSupabaseAvailable } from './supabase'

// ============================================================
// Storage Keys
// ============================================================
const DEVICE_ID_KEY = 'fc_device_id'
const LAST_VISIT_KEY = 'fc_last_visit'
const VISITOR_ID_KEY = 'fc_visitor_id'
const VISIT_ID_KEY = 'fc_visit_id'

// ============================================================
// Utilities
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

function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY)
    if (existing) return existing
    const newId = generateUUID()
    localStorage.setItem(DEVICE_ID_KEY, newId)
    return newId
  } catch {
    return generateUUID()
  }
}

async function sha256short(str: string): Promise<string> {
  try {
    const buffer = new TextEncoder().encode(str)
    const hash = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 20)
  } catch {
    let h = 0
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i)
    }
    return Math.abs(h).toString(16)
  }
}

// ============================================================
// Fingerprint Signals
// ============================================================

function getCanvasHash(): string {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 240
    canvas.height = 60
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.fillStyle = '#e91e63'
    ctx.fillRect(0, 0, 240, 60)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px Arial, sans-serif'
    ctx.fillText('fc_fp_2025', 12, 35)
    ctx.fillStyle = 'rgba(0,150,255,0.7)'
    ctx.beginPath()
    ctx.arc(200, 30, 20, 0, Math.PI * 2)
    ctx.fill()

    return canvas.toDataURL()
  } catch {
    return ''
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

      const timeout = setTimeout(() => finish(null, null), 2500)

      pc.createDataChannel('')
      pc.createOffer()
        .then((o) => pc.setLocalDescription(o))
        .catch(() => { clearTimeout(timeout); finish(null, null) })

      pc.onicecandidate = (event) => {
        if (!event?.candidate?.candidate) return
        const match = event.candidate.candidate.match(
          /(?:^|[\s;])(\d{1,3}(?:\.\d{1,3}){3})(?=\s|$)/
        )
        if (!match) return
        const ip = match[1]
        const isPrivate =
          ip.startsWith('192.168.') ||
          ip.startsWith('10.') ||
          /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
        if (isPrivate) {
          clearTimeout(timeout)
          const parts = ip.split('.')
          finish(ip, parts.slice(0, 3).join('.'))
        }
      }
    } catch {
      resolve({ ip: null, subnet: null })
    }
  })
}

interface FingerprintData {
  deviceId: string
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

  const rawCanvas = typeof window !== 'undefined' ? getCanvasHash() : ''
  const canvasHash = await sha256short(rawCanvas)

  const screenResolution =
    typeof window !== 'undefined'
      ? `${window.screen.width}x${window.screen.height}`
      : ''
  const colorDepth =
    typeof window !== 'undefined' ? String(window.screen.colorDepth ?? 24) : '24'
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  const language = (typeof navigator !== 'undefined' && navigator.language) || ''
  const cpuCores =
    (typeof navigator !== 'undefined' && (navigator as any).hardwareConcurrency) || 0
  const deviceMemory =
    (typeof navigator !== 'undefined' && (navigator as any).deviceMemory) ?? null

  let connectionType: string | null = null
  try {
    const conn =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection
    connectionType = conn?.type ?? conn?.effectiveType ?? null
  } catch {}

  let webrtcLocalIp: string | null = null
  let webrtcSubnet: string | null = null
  try {
    const rtc = await getWebRTCLocalIP()
    webrtcLocalIp = rtc.ip
    webrtcSubnet = rtc.subnet
  } catch {}

  // Stable fingerprint: excludes network/IP, uses hardware + browser signals
  const fingerprintSource = [
    canvasHash,
    screenResolution,
    colorDepth,
    timezone,
    language,
    String(cpuCores),
  ].join('|')
  const fingerprintHash = await sha256short(fingerprintSource)

  return {
    deviceId,
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
// Tracking Service
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
      const lastVisitStr = sessionStorage.getItem(LAST_VISIT_KEY)
      const now = Date.now()
      const isNewSession = !lastVisitStr || now - parseInt(lastVisitStr) > 30_000

      if (isNewSession) {
        const fingerprint = await collectFingerprint()
        await this.startSession(fingerprint)
        sessionStorage.setItem(LAST_VISIT_KEY, String(now))
      } else {
        // Restore session IDs from storage
        this.visitorId = sessionStorage.getItem(VISITOR_ID_KEY)
        this.visitId = sessionStorage.getItem(VISIT_ID_KEY)
      }

      this.initScrollTracking()
      this.isInitialized = true
    } catch {
      // Tracking must never break the app
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

        if (this.visitorId) sessionStorage.setItem(VISITOR_ID_KEY, this.visitorId)
        if (this.visitId) sessionStorage.setItem(VISIT_ID_KEY, this.visitId)
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
              metadata: { milestone: m, depth: this.maxScrollDepth },
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
        page_path: event.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : null),
        element_id: event.elementId ?? null,
        element_class: event.elementClass ?? null,
        metadata: event.metadata ?? {},
      })
    } catch {}
  }

  trackPageView(pagePath?: string) {
    this.trackEvent({
      eventType: 'pageview',
      pagePath: pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
    })
  }

  trackClick(elementId: string, elementClass?: string, eventName?: string) {
    this.trackEvent({ eventType: 'click', eventName, elementId, elementClass })
  }

  public trackScrollMilestone(milestone: number) {
    this.trackEvent({
      eventType: 'scroll',
      eventName: `scroll_${milestone}`,
      metadata: { milestone },
    })
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
// Singleton
// ============================================================

let instance: TrackingService | null = null

export const getTrackingService = (): TrackingService => {
  if (!instance) instance = new TrackingService()
  return instance
}

export const useTracking = () => getTrackingService()
