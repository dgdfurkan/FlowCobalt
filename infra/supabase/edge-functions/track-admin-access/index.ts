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
    console.log('Track-admin-access function called')
    
    // Get IP address from request headers
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    console.log('IP Address:', ipAddress)

    // Get request body
    const { accessType, pagePath, attemptedUsername, userAgent } = await req.json()
    console.log('Request body:', { accessType, pagePath, attemptedUsername, userAgent })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get geolocation using ip-api.com
    let country = 'Unknown'
    let city = 'Unknown'
    let region = 'Unknown'
    
    try {
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
      country = req.headers.get('cf-ipcountry') || 'Unknown'
      city = req.headers.get('cf-ipcity') || 'Unknown'
    }

    // Find or create visitor
    let visitorId: string | null = null
    
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('id')
      .eq('ip_address', ipAddress)
      .single()

    if (existingVisitor) {
      visitorId = existingVisitor.id
    } else {
      // Create new visitor for admin access log
      const { data: newVisitor, error: visitorError } = await supabase
        .from('visitors')
        .insert({
          ip_address: ipAddress,
          country,
          city,
          region,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
          visit_count: 0, // Admin access doesn't count as regular visit
        })
        .select()
        .single()

      if (!visitorError && newVisitor) {
        visitorId = newVisitor.id
      }
    }

    // Insert admin access log
    const { data: accessLog, error: logError } = await supabase
      .from('admin_access_logs')
      .insert({
        visitor_id: visitorId,
        ip_address: ipAddress,
        access_type: accessType, // 'login_page', 'admin_panel', 'failed_login'
        page_path: pagePath,
        attempted_username: attemptedUsername || null,
        user_agent: userAgent,
        country,
        city,
        region,
      })
      .select()
      .single()

    if (logError) {
      console.error('Error creating admin access log:', logError)
      throw logError
    }

    console.log('Admin access log created:', accessLog?.id)

    // Check if visitor is muted
    if (visitorId) {
      const { data: visitor } = await supabase
        .from('visitors')
        .select('is_muted')
        .eq('id', visitorId)
        .single()

      if (!visitor?.is_muted && accessLog) {
        // Trigger Telegram notification (async, don't wait)
        console.log('Triggering Telegram notification for admin access')
        
        const telegramUrl = `${supabaseUrl}/functions/v1/send-telegram`
        const telegramPayload = {
          type: 'admin_access',
          accessType,
          ipAddress,
          country,
          city,
          region,
          pagePath,
          attemptedUsername,
          accessLogId: accessLog.id,
        }

        fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'x-client-info': 'edge-function',
          },
          body: JSON.stringify(telegramPayload),
        })
          .then(async (response) => {
            const result = await response.json()
            console.log('Telegram notification response:', result)
          })
          .catch((error) => {
            console.error('Telegram notification error:', error)
          })
      } else {
        console.log('Visitor is muted, skipping Telegram notification')
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        accessLogId: accessLog?.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('Track-admin-access error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

