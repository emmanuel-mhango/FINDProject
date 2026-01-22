/// <reference lib="deno.window" />
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:5173'

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { status: 500 })
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

    let body: any = {}
    try {
      body = await req.json()
    } catch (_) {
      body = {}
    }

    const email: string = body.email
    const user_id: string | undefined = body.user_id
    const firstName: string = body.firstName || 'User'

    if (!email || !user_id) {
      return new Response(JSON.stringify({ error: 'Missing email or user_id' }), { status: 400 })
    }

    // Generate verification token
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Store token in profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        user_id,
        email_verification_token: token,
        email_verification_expires: expires,
        is_email_verified: false
      }, { onConflict: 'user_id' })

    if (updateError) {
      console.error('Failed to store token:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to generate verification token' }), { status: 500 })
    }

    const confirmationUrl = `${SITE_URL}/confirm-email?token=${token}&email=${encodeURIComponent(email)}`

    // Send email via Resend
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { color: #dc2626; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
    .content { color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
    .button { background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
    .footer { color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; }
    .code-box { background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; word-break: break-all; font-size: 12px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🎯 FIND</div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>Thank you for registering with FIND! To complete your email verification, please click the button below:</p>
      <a href="${confirmationUrl}" class="button">Verify Email Address</a>
      <p>Or copy and paste this link:</p>
      <div class="code-box">${confirmationUrl}</div>
      <p>This link expires in 24 hours.</p>
    </div>
    <div class="footer">
      <p>© 2026 FIND Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`

    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'FIND <onboarding@resend.dev>',
          to: email,
          subject: 'Verify Your Email - FIND',
          html: html
        })
      })

      if (!resendRes.ok) {
        const error = await resendRes.text()
        console.error('Resend API error:', error)
        return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
      }

      const resendData = await resendRes.json()
      console.log('Email sent via Resend:', resendData)

      return new Response(JSON.stringify({ 
        ok: true, 
        message: 'Verification email sent',
        confirmationUrl 
      }), { status: 200 })
    } catch (emailErr: any) {
      console.error('Email sending error:', emailErr)
      return new Response(JSON.stringify({ error: 'Failed to send verification email' }), { status: 500 })
    }
  } catch (err: any) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500 })
  }
})
