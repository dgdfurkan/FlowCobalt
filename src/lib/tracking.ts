import { supabase, isSupabaseAvailable } from './supabase'

interface TrackingEvent {
  eventType: 'pageview' | 'click' | 'form_submit'
  eventName?: string
  pagePath?: string
  elementId?: string
  elementClass?: string
  metadata?: Record<string, any>
}

class TrackingService {
  private sessionId: string
  private visitorId: string | null = null
  private visitId: string | null = null
  private isInitialized = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.init()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async init() {
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not available, tracking disabled')
      return
    }

    // Check if this is a refresh (new visit) or just route change
    const lastVisitTime = sessionStorage.getItem('lastVisitTime')
    const currentTime = Date.now()
    const isRefresh = !lastVisitTime || (currentTime - parseInt(lastVisitTime)) > 30000 // 30 seconds threshold

    if (isRefresh) {
      await this.trackVisit()
      sessionStorage.setItem('lastVisitTime', currentTime.toString())
    }

    this.isInitialized = true
  }

  private async trackVisit() {
    if (!isSupabaseAvailable()) return

    try {
      // Call Supabase Edge Function directly (works in static export)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      const response = await fetch(`${supabaseUrl}/functions/v1/track-visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          pagePath: window.location.pathname,
          userAgent: navigator.userAgent,
          referer: document.referrer,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.visitorId = data.visitorId
        this.visitId = data.visitId
      }
    } catch (error) {
      console.error('Tracking error:', error)
    }
  }

  async trackEvent(event: TrackingEvent) {
    if (!isSupabaseAvailable() || !this.isInitialized) return

    try {
      await supabase.from('events').insert({
        visit_id: this.visitId,
        visitor_id: this.visitorId,
        event_type: event.eventType,
        event_name: event.eventName,
        page_path: event.pagePath || window.location.pathname,
        element_id: event.elementId,
        element_class: event.elementClass,
        metadata: event.metadata || {},
      })
    } catch (error) {
      console.error('Event tracking error:', error)
    }
  }

  trackPageView(pagePath?: string) {
    this.trackEvent({
      eventType: 'pageview',
      pagePath: pagePath || window.location.pathname,
    })
  }

  trackClick(elementId: string, elementClass?: string, eventName?: string) {
    this.trackEvent({
      eventType: 'click',
      eventName: eventName,
      elementId: elementId,
      elementClass: elementClass,
    })
  }
}

// Singleton instance
let trackingInstance: TrackingService | null = null

export const getTrackingService = (): TrackingService => {
  if (!trackingInstance) {
    trackingInstance = new TrackingService()
  }
  return trackingInstance
}

// Hook for React components
export const useTracking = () => {
  return getTrackingService()
}

