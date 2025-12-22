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
    // Get IP address from request headers
    const forwardedFor = req.headers.get('x-forwarded-for')
    const realIp = req.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    // Get request body
    const { pagePath, userAgent, referer } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get geolocation (simplified - in production use a proper geolocation service)
    const country = req.headers.get('cf-ipcountry') || 'Unknown'
    const city = req.headers.get('cf-ipcity') || 'Unknown'

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
        user_agent: userAgent,
        referer: referer || null,
        page_path: pagePath,
        is_new_visit: isNewVisit,
      })
      .select()
      .single()

    if (visitError) throw visitError

    // Check if notifications should be sent (not muted)
    const { data: visitor } = await supabase
      .from('visitors')
      .select('is_muted')
      .eq('id', visitorId)
      .single()

    if (!visitor?.is_muted) {
      // Trigger Telegram notification (async, don't wait)
      fetch(`${supabaseUrl}/functions/v1/send-telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          visitorId,
          visitId: visit.id,
          isNewVisit,
          ipAddress,
          country,
          city,
        }),
      }).catch(console.error)
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

