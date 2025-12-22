import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Track-visit function called')
    
    // Get IP address from request headers
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    console.log('IP Address:', ipAddress)

    // Get request body
    const { pagePath, userAgent, referer } = await req.json()
    console.log('Request body:', { pagePath, userAgent, referer })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service Role Key exists:', !!supabaseKey)
    console.log('Service Role Key length:', supabaseKey?.length || 0)
    console.log('Service Role Key prefix:', supabaseKey?.substring(0, 20) || 'N/A')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get geolocation using ip-api.com (free tier, no API key needed)
    let country = 'Unknown'
    let city = 'Unknown'
    let region = 'Unknown'
    
    try {
      // Use ip-api.com for geolocation (free, no API key required)
      const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city,timezone`)
      if (geoResponse.ok) {
        const geoData = await geoResponse.json()
        if (geoData.status === 'success') {
          country = geoData.country || 'Unknown'
          city = geoData.city || 'Unknown'
          region = geoData.regionName || 'Unknown'
        }
      }
    } catch (error) {
      console.error('Geolocation error:', error)
      // Fallback to Cloudflare headers if available
      country = req.headers.get('cf-ipcountry') || 'Unknown'
      city = req.headers.get('cf-ipcity') || 'Unknown'
    }

    // Check if visitor exists
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('ip_address', ipAddress)
      .single()

    let visitorId: string
    let isNewVisit = false

    if (existingVisitor) {
      // Update existing visitor
      visitorId = existingVisitor.id
      const visitCount = existingVisitor.visit_count + 1
      
      await supabase
        .from('visitors')
        .update({
          last_seen_at: new Date().toISOString(),
          visit_count: visitCount,
          country,
          city,
          region,
        })
        .eq('id', visitorId)

      // Check if this is a returning visit (not muted)
      isNewVisit = false
    } else {
      // Create new visitor
      const { data: newVisitor, error } = await supabase
        .from('visitors')
        .insert({
          ip_address: ipAddress,
          country,
          city,
          region,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          visit_count: 1,
        })
        .select()
        .single()

      if (error) throw error
      visitorId = newVisitor.id
      isNewVisit = true
    }

    // Create visit record
    const { data: visit, error: visitError } = await supabase
      .from('visits')
      .insert({
        visitor_id: visitorId,
        ip_address: ipAddress,
        country,
        city,
        region,
        user_agent: userAgent,
        referer: referer || null,
        page_path: pagePath,
        is_new_visit: isNewVisit,
      })
      .select()
      .single()

    if (visitError) {
      console.error('Error creating visit:', visitError)
      throw visitError
    }

    console.log('Visit created successfully:', visit.id, 'isNewVisit:', isNewVisit)

    // Check if notifications should be sent (not muted)
    const { data: visitor, error: visitorCheckError } = await supabase
      .from('visitors')
      .select('is_muted')
      .eq('id', visitorId)
      .single()

    if (visitorCheckError) {
      console.error('Error checking visitor mute status:', visitorCheckError)
    }

    console.log('Visitor mute status:', visitor?.is_muted)

    if (!visitor?.is_muted) {
      // Trigger Telegram notification (async, don't wait)
      console.log('Triggering Telegram notification for visitor:', visitorId, 'isNewVisit:', isNewVisit)
      console.log('Supabase URL:', supabaseUrl)
      console.log('Supabase Key exists:', !!supabaseKey)
      console.log('Telegram endpoint:', `${supabaseUrl}/functions/v1/send-telegram`)
      
      const telegramPayload = {
        visitorId,
        visitId: visit.id,
        isNewVisit,
        ipAddress,
        country,
        city,
        region,
      }
      console.log('Telegram payload:', telegramPayload)
      
      const telegramUrl = `${supabaseUrl}/functions/v1/send-telegram`
      console.log('Calling Telegram function at:', telegramUrl)
      
      try {
        // For Supabase Edge Function to Edge Function calls, use apikey header only
        // Service role key should be used as apikey, not as Bearer token
        console.log('Sending request with apikey:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING')
        
        const response = await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
          },
          body: JSON.stringify(telegramPayload),
        })
        
        console.log('Telegram fetch response status:', response.status)
        console.log('Telegram fetch response ok:', response.ok)
        
        const result = await response.json()
        console.log('Telegram notification response:', result)
        
        if (!response.ok) {
          console.error('Telegram notification failed:', result)
        } else {
          console.log('Telegram notification succeeded:', result)
        }
      } catch (fetchError) {
        console.error('Telegram fetch error:', fetchError)
        console.error('Error details:', {
          message: fetchError.message,
          stack: fetchError.stack,
          name: fetchError.name,
        })
      }
    } else {
      console.log('Visitor is muted, skipping Telegram notification')
    }

    return new Response(
      JSON.stringify({
        success: true,
        visitorId,
        visitId: visit.id,
        isNewVisit,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

