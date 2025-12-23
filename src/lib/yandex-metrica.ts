/**
 * Yandex Metrica Integration
 * Loads Yandex Metrica only if user has accepted cookies
 */

declare global {
  interface Window {
    ym?: (
      counterId: number,
      method: string,
      ...args: any[]
    ) => void
  }
}

const YANDEX_METRICA_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID

let isInitialized = false
let isScriptLoaded = false

/**
 * Check if user has accepted cookies
 */
function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  const consent = localStorage.getItem('cookie_consent')
  return consent === 'accepted'
}

/**
 * Load Yandex Metrica script
 */
function loadYandexMetricaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isScriptLoaded || typeof window === 'undefined') {
      resolve()
      return
    }

    // Check if script already exists
    if (document.querySelector('script[src*="metrika/tag.js"]')) {
      isScriptLoaded = true
      resolve()
      return
    }

    if (!YANDEX_METRICA_ID) {
      reject(new Error('Yandex Metrica ID not configured'))
      return
    }

    // Initialize Yandex Metrica function first
    ;(function (m: any, e: any, t: string, r: any, i: string, k?: string, a?: any) {
      m[i] =
        m[i] ||
        function () {
          ;(m[i].a = m[i].a || []).push(arguments)
        }
      m[i].l = 1 * new Date().getTime()
      a = e.createElement(t)
      r = e.getElementsByTagName(t)[0]
      a.async = 1
      a.src = 'https://mc.yandex.ru/metrika/tag.js'
      if (r && r.parentNode) {
        (r.parentNode as HTMLElement).insertBefore(a, r)
      }
    })(window, document, 'script', '', 'ym')

    // Create noscript fallback
    const noscript = document.createElement('noscript')
    const img = document.createElement('img')
    img.src = `https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`
    img.style.position = 'absolute'
    img.style.left = '-9999px'
    img.alt = ''
    noscript.appendChild(img)
    document.body.appendChild(noscript)

    // Wait for script to load
    const checkScript = setInterval(() => {
      if (typeof window.ym === 'function') {
        clearInterval(checkScript)
        isScriptLoaded = true
        resolve()
      }
    }, 50)

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkScript)
      if (!isScriptLoaded) {
        reject(new Error('Yandex Metrica script load timeout'))
      }
    }, 5000)
  })
}

/**
 * Initialize Yandex Metrica
 */
function initializeYandexMetrica(): void {
  if (isInitialized || !YANDEX_METRICA_ID) return

  try {
    // Initialize Yandex Metrica counter
    const counterId = parseInt(YANDEX_METRICA_ID, 10)
    
    // Wait for script to be fully loaded
    if (typeof window.ym === 'function') {
      window.ym(counterId, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      })

      isInitialized = true
      
      // Track current page immediately after initialization
      if (typeof window !== 'undefined' && window.location) {
        trackPageView(window.location.pathname + window.location.search)
      }
    } else {
      // Script not loaded yet, wait a bit
      setTimeout(() => {
        if (typeof window.ym === 'function') {
          window.ym(counterId, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
          })
          isInitialized = true
          
          // Track current page immediately after initialization
          if (typeof window !== 'undefined' && window.location) {
            trackPageView(window.location.pathname + window.location.search)
          }
        }
      }, 100)
    }
  } catch (error) {
    // Silent fail - don't log errors in production
  }
}

/**
 * Initialize Yandex Metrica if consent is given
 */
export function initYandexMetrica(): void {
  if (typeof window === 'undefined') return

  // Check cookie consent
  if (!hasCookieConsent()) {
    return
  }

  // Load script and initialize
  loadYandexMetricaScript()
    .then(() => {
      initializeYandexMetrica()
    })
    .catch(() => {
      // Silent fail - don't log errors in production
    })
}

/**
 * Track page view
 */
export function trackPageView(url: string): void {
  if (!YANDEX_METRICA_ID) {
    return
  }

  // If not initialized yet, wait a bit and try again
  if (!isInitialized) {
    setTimeout(() => {
      trackPageView(url)
    }, 200)
    return
  }

  try {
    const counterId = parseInt(YANDEX_METRICA_ID, 10)
    if (typeof window.ym === 'function') {
      window.ym(counterId, 'hit', url)
    }
  } catch (error) {
    // Silent fail - don't log errors in production
  }
}

/**
 * Track event
 */
export function trackEvent(category: string, action: string, label?: string): void {
  if (!isInitialized || !YANDEX_METRICA_ID) return

  try {
    const counterId = parseInt(YANDEX_METRICA_ID, 10)
    window.ym?.(counterId, 'reachGoal', action, {
      category,
      label,
    })
  } catch (error) {
    // Silent fail - don't log errors in production
  }
}

/**
 * Listen for cookie consent changes
 */
export function setupCookieConsentListener(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('cookieConsentAccepted', () => {
    initYandexMetrica()
  })
}

