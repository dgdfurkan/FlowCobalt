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
    const { visitorId, visitId, isNewVisit, ipAddress, country, city, region } = await req.json()

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

    // Check if enabled (value can be JSONB boolean true or string "true")
    const isEnabled = telegramEnabled?.value === true || telegramEnabled?.value === 'true' || telegramEnabled?.value === '"true"'
    
    if (!telegramEnabled || !isEnabled) {
      console.log('Telegram notifications disabled or not configured:', telegramEnabled)
      return new Response(
        JSON.stringify({ success: false, message: 'Telegram notifications disabled', debug: telegramEnabled }),
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

    // Parse JSONB values correctly
    const botToken = typeof botTokenData.value === 'string' 
      ? botTokenData.value.replace(/^"|"$/g, '') // Remove quotes if string
      : botTokenData.value
    
    const chatIds = Array.isArray(chatIdsData.value) 
      ? chatIdsData.value 
      : (typeof chatIdsData.value === 'string' ? JSON.parse(chatIdsData.value) : [])

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
    const location = region && region !== 'Unknown' 
      ? `${country}, ${region}, ${city}` 
      : `${country}, ${city}`
    
    if (isNewVisit) {
      message = `🆕 New Visitor\n📍 IP: ${ipAddress}\n🌍 Location: ${location}\n🕐 Time: ${dateTime}`
    } else {
      const visitCount = visitor?.visit_count || 1
      message = `🔁 Returning Visitor\n📍 IP: ${ipAddress}\n🌍 Location: ${location}\n📊 Visit #${visitCount}\n🕐 Time: ${dateTime}`
    }

    // Send to all chat IDs
    const results = await Promise.allSettled(
      chatIds.map((chatId) => {
        const chatIdStr = String(chatId).trim()
        console.log(`Sending Telegram message to chat ID: ${chatIdStr}`)
        return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatIdStr,
            text: message,
          }),
        })
      })
    )

    const successCount = results.filter((r) => r.status === 'fulfilled').length
    const failures = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason)

    // Log results for debugging
    console.log(`Telegram notification results: ${successCount}/${chatIds.length} sent successfully`)
    if (failures.length > 0) {
      console.error('Telegram notification failures:', failures)
    }

    return new Response(
      JSON.stringify({
        success: true,
        sentTo: successCount,
        total: chatIds.length,
        failures: failures.length > 0 ? failures : undefined,
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

