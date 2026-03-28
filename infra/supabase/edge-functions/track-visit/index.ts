import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================
// Types
// ============================================================

interface RequestBody {
  pagePath: string
  userAgent: string
  referer?: string | null
  visitorIdHint?: string | null  // stored visitor UUID from client (localStorage + cookie)
  // Fingerprint signals
  deviceId?: string
  fingerprintHash?: string
  canvasHash?: string
  screenResolution?: string
  colorDepth?: string
  timezone?: string
  language?: string
  cpuCores?: number
  deviceMemory?: number | null
  webrtcLocalIp?: string | null
  webrtcSubnet?: string | null
  connectionType?: string | null
}

interface DeviceInfo {
  browser: string
  os: string
  deviceType: 'Mobile' | 'Tablet' | 'Desktop'
}

// ============================================================
// Helpers
// ============================================================

function parseDevice(ua: string): DeviceInfo {
  const u = ua.toLowerCase()

  const isTablet = /ipad|tablet|kindle/.test(u)
  const isMobile = !isTablet && /mobile|android|iphone/.test(u)

  let browser = 'Unknown'
  if (/edg\//.test(u)) browser = 'Edge'
  else if (/chrome/.test(u) && !/chromium/.test(u)) browser = 'Chrome'
  else if (/firefox/.test(u)) browser = 'Firefox'
  else if (/safari/.test(u) && !/chrome/.test(u)) browser = 'Safari'
  else if (/opera|opr\//.test(u)) browser = 'Opera'

  let os = 'Unknown'
  if (/windows nt/.test(u)) os = 'Windows'
  else if (/macintosh|mac os x/.test(u)) os = 'macOS'
  else if (/android/.test(u)) os = 'Android'
  else if (/iphone|ipad/.test(u)) os = 'iOS'
  else if (/linux/.test(u)) os = 'Linux'

  const deviceType: DeviceInfo['deviceType'] = isTablet
    ? 'Tablet'
    : isMobile
    ? 'Mobile'
    : 'Desktop'

  return { browser, os, deviceType }
}

function formatVisitorNumber(num: number): string {
  return `V-${String(num).padStart(4, '0')}`
}

async function getGeoData(
  ip: string,
  headers: Headers
): Promise<{ country: string; city: string; region: string }> {
  // 1. Cloudflare edge headers (fastest, zero latency)
  const cfCountry = headers.get('cf-ipcountry')
  const cfCity = headers.get('cf-ipcity')
  const cfRegion = headers.get('cf-region')

  if (cfCountry && cfCountry !== 'XX') {
    return {
      country: cfCountry,
      city: cfCity || 'Unknown',
      region: cfRegion || 'Unknown',
    }
  }

  // 2. Fallback: ip-api.com (free, reliable)
  try {
    const r = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`,
      { signal: AbortSignal.timeout(3000) }
    )
    if (r.ok) {
      const d = await r.json()
      if (d.status === 'success') {
        return { country: d.country, city: d.city, region: d.regionName }
      }
    }
  } catch {}

  return { country: 'Unknown', city: 'Unknown', region: 'Unknown' }
}

// ============================================================
// Identity Resolution
// ============================================================

async function resolveVisitor(
  sb: ReturnType<typeof createClient>,
  visitorIdHint: string | null | undefined,
  deviceId: string | undefined,
  fingerprintHash: string | undefined,
  webrtcSubnet: string | undefined,
  ipAddress: string
): Promise<{ visitor: any; confidence: string; isNew: boolean }> {

  // 0. Visitor ID hint (client stored this UUID from a previous session — most reliable)
  //    Works even when IP changes AND deviceId is lost (incognito, localStorage cleared)
  if (visitorIdHint) {
    const { data } = await sb
      .from('visitors')
      .select('*')
      .eq('id', visitorIdHint)
      .maybeSingle()
    if (data) return { visitor: data, confidence: 'device', isNew: false }
  }

  // 1. Device ID (localStorage — persists across browser restarts)
  if (deviceId) {
    const { data } = await sb
      .from('visitors')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle()
    if (data) return { visitor: data, confidence: 'device', isNew: false }
  }

  // 2. Fingerprint hash (stable hardware signals)
  if (fingerprintHash) {
    const { data } = await sb
      .from('visitors')
      .select('*')
      .eq('fingerprint_hash', fingerprintHash)
      .maybeSingle()
    if (data) return { visitor: data, confidence: 'fingerprint', isNew: false }
  }

  // 3. Same WiFi subnet in last 48 hours (probable same person)
  if (webrtcSubnet) {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const { data } = await sb
      .from('visitors')
      .select('*')
      .eq('last_webrtc_subnet', webrtcSubnet)
      .gt('last_seen_at', cutoff)
      .order('last_seen_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) return { visitor: data, confidence: 'network', isNew: false }
  }

  // 4. IP address history
  if (ipAddress && ipAddress !== 'unknown') {
    const { data: ipRec } = await sb
      .from('visitor_ips')
      .select('visitor_id')
      .eq('ip_address', ipAddress)
      .order('last_seen_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (ipRec?.visitor_id) {
      const { data } = await sb
        .from('visitors')
        .select('*')
        .eq('id', ipRec.visitor_id)
        .maybeSingle()
      if (data) return { visitor: data, confidence: 'ip', isNew: false }
    }
  }

  return { visitor: null, confidence: 'device', isNew: true }
}

// ============================================================
// Handler
// ============================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- Parse IP ---
    const forwarded = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'

    // --- Parse body ---
    const body: RequestBody = await req.json()
    const {
      pagePath,
      userAgent = '',
      referer = null,
      visitorIdHint = null,
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
    } = body

    // --- Supabase (service role for trusted writes) ---
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // --- Parallel: geo + device parse ---
    const [geo, device] = await Promise.all([
      getGeoData(ipAddress, req.headers),
      Promise.resolve(parseDevice(userAgent)),
    ])
    const { country, city, region } = geo

    // ===================================================
    // IDENTITY RESOLUTION
    // ===================================================
    const { visitor, confidence, isNew } = await resolveVisitor(
      sb,
      visitorIdHint,
      deviceId,
      fingerprintHash,
      webrtcSubnet,
      ipAddress
    )

    let visitorId: string
    let freshVisitor: any

    if (isNew) {
      // --- Create new visitor ---
      const { data: numData } = await sb.rpc('next_visitor_number')
      const visitorNumber = (numData as number) || 1

      const insertData: Record<string, unknown> = {
        visitor_number: visitorNumber,
        is_trusted: false,
        is_muted: false,
        match_confidence: 'device',
        visit_count: 1,
        ip_address: ipAddress !== 'unknown' ? ipAddress : null,
        last_country: country,
        last_city: city,
        last_region: region,
        last_user_agent: userAgent,
        last_page_path: pagePath,
        last_screen_resolution: screenResolution ?? null,
        last_connection_type: connectionType ?? null,
        last_webrtc_subnet: webrtcSubnet ?? null,
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      }

      if (deviceId) insertData.device_id = deviceId
      if (fingerprintHash) insertData.fingerprint_hash = fingerprintHash

      const { data: newVisitor, error: insertError } = await sb
        .from('visitors')
        .insert(insertData)
        .select()
        .single()

      if (insertError) throw insertError

      visitorId = newVisitor.id
      freshVisitor = newVisitor
    } else {
      // --- Update existing visitor ---
      visitorId = visitor.id

      const updateData: Record<string, unknown> = {
        last_seen_at: new Date().toISOString(),
        visit_count: (visitor.visit_count || 0) + 1,
        last_country: country,
        last_city: city,
        last_region: region,
        last_user_agent: userAgent,
        last_page_path: pagePath,
        match_confidence: confidence,
      }

      // Always save deviceId if we didn't have one (bootstraps identity for returning IP visitors)
      if (deviceId && !visitor.device_id) updateData.device_id = deviceId
      // Save fingerprint if missing — also update if we got a better confidence match
      if (fingerprintHash && !visitor.fingerprint_hash) updateData.fingerprint_hash = fingerprintHash
      if (screenResolution) updateData.last_screen_resolution = screenResolution
      if (connectionType) updateData.last_connection_type = connectionType
      if (webrtcSubnet) updateData.last_webrtc_subnet = webrtcSubnet

      await sb.from('visitors').update(updateData).eq('id', visitorId)

      const { data: updated } = await sb
        .from('visitors')
        .select('*')
        .eq('id', visitorId)
        .single()
      freshVisitor = updated || visitor
    }

    // --- Record IP in history ---
    if (ipAddress !== 'unknown') {
      await sb.from('visitor_ips').upsert(
        {
          visitor_id: visitorId,
          ip_address: ipAddress,
          country,
          city,
          region,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'visitor_id,ip_address', ignoreDuplicates: false }
      )
    }

    // --- Fingerprint snapshot ---
    await sb.from('visitor_fingerprints').insert({
      visitor_id: visitorId,
      device_id: deviceId ?? null,
      fingerprint_hash: fingerprintHash ?? null,
      canvas_hash: canvasHash ?? null,
      user_agent: userAgent,
      screen_resolution: screenResolution ?? null,
      color_depth: colorDepth ?? null,
      timezone: timezone ?? null,
      language: language ?? null,
      cpu_cores: cpuCores ?? null,
      device_memory: deviceMemory ?? null,
      webrtc_local_ip: webrtcLocalIp ?? null,
      webrtc_subnet: webrtcSubnet ?? null,
      connection_type: connectionType ?? null,
    })

    // --- Create session record ---
    const { data: visit, error: visitError } = await sb
      .from('visits')
      .insert({
        visitor_id: visitorId,
        ip_address: ipAddress !== 'unknown' ? ipAddress : null,
        country,
        city,
        region,
        user_agent: userAgent,
        referer: referer ?? null,
        page_path: pagePath,
        is_new_visit: isNew,
      })
      .select()
      .single()

    if (visitError) throw visitError

    // ===================================================
    // TELEGRAM — fires ONCE per session, on site arrival
    // ===================================================
    if (!freshVisitor?.is_muted) {
      const telegramPayload = {
        // Visitor identity
        visitorId,
        visitId: visit.id,
        isNew,
        matchConfidence: confidence,
        isTrusted: freshVisitor?.is_trusted ?? false,
        displayName: freshVisitor?.display_name ?? null,
        visitorNumber: freshVisitor?.visitor_number ?? null,
        // Location
        ipAddress,
        country,
        city,
        region,
        // Session
        pagePath,
        referer: referer ?? null,
        // Device
        browser: device.browser,
        os: device.os,
        deviceType: device.deviceType,
        visitCount: freshVisitor?.visit_count ?? 1,
      }

      // Fire-and-forget — don't let Telegram delay the response
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify(telegramPayload),
      }).catch(() => {})
    }

    return new Response(
      JSON.stringify({
        success: true,
        visitorId,
        visitId: visit.id,
        isNew,
        isTrusted: freshVisitor?.is_trusted ?? false,
        visitorLabel: freshVisitor?.is_trusted
          ? (freshVisitor?.display_name ?? formatVisitorNumber(freshVisitor?.visitor_number ?? 0))
          : formatVisitorNumber(freshVisitor?.visitor_number ?? 0),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Internal error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
