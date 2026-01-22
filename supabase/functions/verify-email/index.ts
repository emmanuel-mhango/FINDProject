import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const url = new URL(req.url)
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variables' }), { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

    // Read body once (if any)
    let body: any = {}
    try {
      body = req.method !== 'GET' ? await req.json() : {}
    } catch (_) {
      body = {}
    }

    const token = url.searchParams.get('token') || body.token
    const email = url.searchParams.get('email') || body.email

    if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 })

    // Find profile with token
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_id, email_verification_expires')
      .eq('email_verification_token', token)
      .single()

    if (error || !profile) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 400 })

    const expiresRaw = profile.email_verification_expires
    if (!expiresRaw) return new Response(JSON.stringify({ error: 'No expiry on token' }), { status: 400 })

    const expires = new Date(expiresRaw)
    if (isNaN(expires.getTime()) || expires < new Date()) return new Response(JSON.stringify({ error: 'Token expired' }), { status: 400 })

    // Mark profile as verified
    try {
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ is_email_verified: true, email_verification_token: null, email_verification_expires: null })
        .eq('email_verification_token', token)

      if (updErr) {
        console.error('Update error:', updErr)
        return new Response(JSON.stringify({ error: 'Failed to verify email', detail: updErr.message }), { status: 500 })
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      return new Response(JSON.stringify({ error: 'Failed to verify email', detail: err.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ ok: true, message: 'Email verified successfully!' }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
})
