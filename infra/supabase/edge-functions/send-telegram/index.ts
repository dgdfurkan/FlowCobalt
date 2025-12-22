import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { visitorId, visitId, isNewVisit, ipAddress, country, city } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Telegram settings
    const { data: telegramEnabled } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_enabled')
      .single()

    if (!telegramEnabled || telegramEnabled.value !== true) {
      return new Response(
        JSON.stringify({ success: false, message: 'Telegram notifications disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Get bot token and chat IDs
    const { data: botTokenData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_bot_token')
      .single()

    const { data: chatIdsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_chat_ids')
      .single()

    if (!botTokenData || !chatIdsData) {
      throw new Error('Telegram configuration not found')
    }

    const botToken = botTokenData.value
    const chatIds = chatIdsData.value as string[]

    if (!botToken || chatIds.length === 0) {
      throw new Error('Telegram bot token or chat IDs not configured')
    }

    // Get visitor info
    const { data: visitor } = await supabase
      .from('visitors')
      .select('visit_count')
      .eq('id', visitorId)
      .single()

    // Format message
    const dateTime = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'short',
      timeStyle: 'short',
    })

    let message = ''
    if (isNewVisit) {
      message = `🆕 Yeni ziyaretçi: ${ipAddress} — ${country}/${city} — ${dateTime}`
    } else {
      const visitCount = visitor?.visit_count || 1
      message = `🔁 Tekrar ziyaret: ${ipAddress} — ${country}/${city} — ${visitCount}. ziyaret — ${dateTime}`
    }

    // Send to all chat IDs
    const results = await Promise.allSettled(
      chatIds.map((chatId) =>
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        })
      )
    )

    const successCount = results.filter((r) => r.status === 'fulfilled').length

    return new Response(
      JSON.stringify({
        success: true,
        sentTo: successCount,
        total: chatIds.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Telegram notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

