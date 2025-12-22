import { supabase, isSupabaseAvailable } from './supabase'

interface TrackingEvent {
  eventType: 'pageview' | 'click' | 'form_submit' | 'scroll'
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
  private currentPagePath: string = ''
  private scrollMilestones: Set<number> = new Set()
  private maxScrollDepth: number = 0
  private scrollListener: (() => void) | null = null

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

    // Initialize scroll tracking
    this.initScrollTracking()

    this.isInitialized = true
  }

  private initScrollTracking() {
    if (typeof window === 'undefined') return

    this.currentPagePath = window.location.pathname
    this.scrollMilestones.clear()
    this.maxScrollDepth = 0

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = scrollHeight > 0 
        ? Math.round((scrollTop / scrollHeight) * 100) 
        : 0

      // Update max scroll depth
      if (scrollPercentage > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercentage
      }

      // Track milestones (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !this.scrollMilestones.has(milestone)) {
          this.scrollMilestones.add(milestone)
          this.trackScroll(milestone)
        }
      })
    }

    // Throttle scroll events (check every 100ms)
    let scrollTimeout: NodeJS.Timeout | null = null
    const throttledScroll = () => {
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        handleScroll()
        scrollTimeout = null
      }, 100)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    this.scrollListener = () => {
      window.removeEventListener('scroll', throttledScroll)
    }

    // Track initial scroll position
    handleScroll()
  }

  private trackScroll(milestone: number) {
    this.trackEvent({
      eventType: 'scroll',
      eventName: `scroll_${milestone}`,
      pagePath: this.currentPagePath,
      metadata: {
        milestone,
        scrollDepth: this.maxScrollDepth,
      },
    })
  }

  // Update scroll depth when page changes
  updatePagePath(newPath: string) {
    if (newPath !== this.currentPagePath) {
      // Save current page scroll data before switching
      this.saveScrollData()
      
      // Reset for new page
      this.currentPagePath = newPath
      this.scrollMilestones.clear()
      this.maxScrollDepth = 0
    }
  }

  private async saveScrollData() {
    if (!this.visitId || this.maxScrollDepth === 0) return

    if (!isSupabaseAvailable() || !supabase) return

    try {
      // Update visit with max scroll depth and milestones
      await supabase
        .from('visits')
        .update({
          scroll_depth: this.maxScrollDepth,
          scroll_events: Array.from(this.scrollMilestones),
        })
        .eq('id', this.visitId)
    } catch (error) {
      console.error('Error saving scroll data:', error)
    }
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
          scrollDepth: this.maxScrollDepth,
          scrollEvents: Array.from(this.scrollMilestones),
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
    if (!isSupabaseAvailable() || !this.isInitialized || !supabase) return

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

  // Public method to track scroll milestone
  public trackScrollMilestone(milestone: number) {
    this.trackScroll(milestone)
  }

  // Cleanup on page unload
  cleanup() {
    if (this.scrollListener) {
      this.scrollListener()
      this.scrollListener = null
    }
    this.saveScrollData()
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

