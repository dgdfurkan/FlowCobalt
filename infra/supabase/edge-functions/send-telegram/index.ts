import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================
// Helpers
// ============================================================

function formatVisitorLabel(visitorNumber: number | null): string {
  if (!visitorNumber) return 'V-????'
  return `V-${String(visitorNumber).padStart(4, '0')}`
}

function formatLocation(country: string, city: string): string {
  const parts = [city, country].filter((p) => p && p !== 'Unknown')
  return parts.length > 0 ? parts.join(', ') : 'Bilinmeyen'
}

function formatPage(pagePath: string): string {
  if (!pagePath || pagePath === '/') return '/'
  return pagePath.length > 40 ? pagePath.slice(0, 40) + '…' : pagePath
}

function buildMessage(payload: {
  isNew: boolean
  matchConfidence: string
  isTrusted: boolean
  displayName: string | null
  visitorNumber: number | null
  country: string
  city: string
  pagePath: string
  browser: string
  os: string
  deviceType: string
  visitCount: number
  referer: string | null
}): string {
  const {
    isNew,
    matchConfidence,
    isTrusted,
    displayName,
    visitorNumber,
    country,
    city,
    pagePath,
    browser,
    os,
    deviceType,
    visitCount,
    referer,
  } = payload

  const location = formatLocation(country, city)
  const page = formatPage(pagePath)
  const deviceStr = `${deviceType} • ${browser} / ${os}`
  const label = formatVisitorLabel(visitorNumber)

  // Trusted visitor
  if (isTrusted && displayName) {
    return (
      `✅ *${displayName} girdi*\n` +
      `📍 ${location}\n` +
      `📄 ${page}\n` +
      `📱 ${deviceStr}`
    )
  }

  // Probable same person via WiFi (different device, same network)
  if (!isNew && matchConfidence === 'network') {
    return (
      `🔄 *Muhtemel ${label}*\n` +
      `📍 ${location}\n` +
      `📄 ${page}\n` +
      `⚠️ Benzer ağ, farklı cihaz\n` +
      `🔁 ${visitCount}. ziyaret`
    )
  }

  // Returning visitor
  if (!isNew) {
    return (
      `👋 *${label} döndü*\n` +
      `📍 ${location}\n` +
      `📄 ${page}\n` +
      `🔁 ${visitCount}. ziyaret\n` +
      `📱 ${deviceStr}`
    )
  }

  // Brand new visitor
  const refLine = referer ? `\n🔗 ${referer.slice(0, 50)}` : ''
  return (
    `🆕 *Yeni Ziyaretçi*\n` +
    `👤 ${label}\n` +
    `📍 ${location}\n` +
    `📄 ${page}\n` +
    `📱 ${deviceStr}` +
    refLine
  )
}

// ============================================================
// Handler
// ============================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Load settings
    const { data: settings } = await sb
      .from('settings')
      .select('key, value')
      .in('key', ['telegram_enabled', 'telegram_bot_token', 'telegram_chat_ids'])

    const settingsMap: Record<string, any> = {}
    for (const row of settings ?? []) {
      settingsMap[row.key] = row.value
    }

    if (!settingsMap['telegram_enabled']) {
      return new Response(JSON.stringify({ skipped: 'disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const botToken: string = settingsMap['telegram_bot_token'] ?? ''
    const chatIds: string[] = settingsMap['telegram_chat_ids'] ?? []

    if (!botToken || chatIds.length === 0) {
      return new Response(JSON.stringify({ skipped: 'no_config' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payload = await req.json()

    const {
      isNew = true,
      matchConfidence = 'ip',
      isTrusted = false,
      displayName = null,
      visitorNumber = null,
      country = 'Unknown',
      city = 'Unknown',
      pagePath = '/',
      browser = 'Unknown',
      os = 'Unknown',
      deviceType = 'Desktop',
      visitCount = 1,
      referer = null,
    } = payload

    const message = buildMessage({
      isNew,
      matchConfidence,
      isTrusted,
      displayName,
      visitorNumber,
      country,
      city,
      pagePath,
      browser,
      os,
      deviceType,
      visitCount,
      referer,
    })

    // Send to all configured chat IDs
    const sends = chatIds.map((chatId: string) =>
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      }).catch(() => null)
    )

    await Promise.allSettled(sends)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Internal error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
