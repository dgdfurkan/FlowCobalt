import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Send-telegram function called')
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Request body received:', body)
    
    const { visitorId, visitId, isNewVisit, ipAddress, country, city, region } = body
    console.log('Parsed params:', { visitorId, visitId, isNewVisit, ipAddress, country, city, region })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Telegram settings
    console.log('Fetching Telegram settings...')
    const { data: telegramEnabled, error: telegramEnabledError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_enabled')
      .single()

    console.log('telegram_enabled query result:', { telegramEnabled, error: telegramEnabledError })

    // Check if enabled (value can be JSONB boolean true or string "true")
    const isEnabled = telegramEnabled?.value === true || telegramEnabled?.value === 'true' || telegramEnabled?.value === '"true"'
    console.log('Telegram enabled check:', { rawValue: telegramEnabled?.value, isEnabled })
    
    if (!telegramEnabled || !isEnabled) {
      console.log('Telegram notifications disabled or not configured:', telegramEnabled)
      return new Response(
        JSON.stringify({ success: false, message: 'Telegram notifications disabled', debug: telegramEnabled }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Get bot token and chat IDs
    console.log('Fetching bot token and chat IDs...')
    const { data: botTokenData, error: botTokenError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_bot_token')
      .single()

    const { data: chatIdsData, error: chatIdsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_chat_ids')
      .single()

    console.log('Bot token query result:', { botTokenData, error: botTokenError })
    console.log('Chat IDs query result:', { chatIdsData, error: chatIdsError })

    if (!botTokenData || !chatIdsData) {
      console.error('Telegram configuration not found')
      throw new Error('Telegram configuration not found')
    }

    // Parse JSONB values correctly
    const botToken = typeof botTokenData.value === 'string' 
      ? botTokenData.value.replace(/^"|"$/g, '') // Remove quotes if string
      : botTokenData.value
    
    const chatIds = Array.isArray(chatIdsData.value) 
      ? chatIdsData.value 
      : (typeof chatIdsData.value === 'string' ? JSON.parse(chatIdsData.value) : [])

    console.log('Parsed bot token:', botToken ? `${botToken.substring(0, 10)}...` : 'MISSING')
    console.log('Parsed chat IDs:', chatIds)

    if (!botToken || chatIds.length === 0) {
      console.error('Bot token or chat IDs missing:', { botToken: !!botToken, chatIdsLength: chatIds.length })
      throw new Error('Telegram bot token or chat IDs not configured')
    }

    // Get visitor info
    console.log('Fetching visitor info...')
    const { data: visitor, error: visitorError } = await supabase
      .from('visitors')
      .select('visit_count')
      .eq('id', visitorId)
      .single()

    console.log('Visitor query result:', { visitor, error: visitorError })

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

    console.log('Formatted message:', message)

    // Send to all chat IDs
    console.log('Sending messages to Telegram API...')
    const results = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        const chatIdStr = String(chatId).trim()
        console.log(`Sending Telegram message to chat ID: ${chatIdStr}`)
        
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
        console.log(`Telegram API URL: ${telegramUrl}`)
        
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatIdStr,
            text: message,
          }),
        })
        
        const responseData = await response.json()
        console.log(`Telegram API response for ${chatIdStr}:`, responseData)
        
        if (!response.ok) {
          throw new Error(`Telegram API error: ${JSON.stringify(responseData)}`)
        }
        
        return responseData
      })
    )

    const successCount = results.filter((r) => r.status === 'fulfilled').length
    const failures = results
      .filter((r) => r.status === 'rejected')
      .map((r) => {
        const reason = (r as PromiseRejectedResult).reason
        console.error('Telegram send failure:', reason)
        return reason
      })

    // Log results for debugging
    console.log(`Telegram notification results: ${successCount}/${chatIds.length} sent successfully`)
    console.log('All results:', results)
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

