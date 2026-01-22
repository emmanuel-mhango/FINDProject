# Email Verification Setup Guide

## Overview
This system uses **Supabase's built-in email verification** system. When users register, they automatically receive a confirmation email.

## Step-by-Step Process

### 1. User Registration
- User visits `/register`
- Fills in form: First Name, Last Name, Email, Password, etc.
- Clicks "Create Account" or "Sign up with Google"

### 2. Email Sent (Automatic)
When email/password registration is used:
```typescript
// In Register.tsx
supabase.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    emailRedirectTo: `${window.location.origin}/confirm-email`,
  }
})
```

**Supabase automatically sends a verification email from:** `noreply@mail.supabase.io`

### 3. User Receives Email
- Subject: "Confirm your signup"
- Contains a link with format: `https://yourapp.com/confirm-email#access_token=...&type=email`

### 4. User Clicks Link
- Browser automatically processes the URL hash
- Supabase creates an authenticated session
- User is redirected to `/confirm-email` page

### 5. Email Verified
- ConfirmEmail.tsx component checks session
- If valid session exists, user is verified
- Profile table updated: `is_email_verified = true`
- User redirected to home page

## Configuration Needed

### In Supabase Dashboard:

1. **Go to:** Authentication → Email Templates
2. **Check:** Email Provider is enabled
3. **Verify:** Redirect URL is set correctly
4. **Confirm:** Email template shows (usually pre-configured)

### For Custom Domain Email (Optional):
1. Go to: Project Settings → Email
2. Configure SMTP or custom domain
3. Current setup uses Supabase's default: `noreply@mail.supabase.io`

## Database Schema

```sql
-- profiles table has these verification fields:
is_email_verified BOOLEAN DEFAULT false  -- Email verification status
email_verification_token UUID            -- Legacy field (not used now)
email_verification_expires TIMESTAMP     -- Legacy field (not used now)
```

## File Structure

```
src/pages/
  ├── Register.tsx        → Signup form, triggers verification email
  ├── SignIn.tsx          → Login form (Google + Email/Password)
  ├── ConfirmEmail.tsx    → Handles email verification callback
  
supabase/
  ├── migrations/
  │   └── 20260108000001_...sql  → profiles table with is_email_verified field
```

## Testing Email Verification

### Test Procedure:
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:8081/register`
3. Register with your email
4. See "Verify Your Email" confirmation screen
5. Check your email inbox (or spam folder)
6. Click the verification link
7. You should be redirected to home page and logged in

### Troubleshooting:

**Email not received:**
- Check spam/promotions folder
- Verify email address is correct
- Check Supabase project dashboard for logs

**Link doesn't work:**
- Verify URL is correct
- Check that `/confirm-email` route exists
- Check browser console for errors

**Already verified but still shows prompt:**
- Check that profile was updated with `is_email_verified = true`
- Refresh page and try again

## Google Sign-In (Bypass Email Verification)

Users can also click "Sign in with Google" to skip email verification entirely:
- No verification email needed
- Google handles authentication
- User is immediately logged in

## Database Tracking

After verification, profile table stores:
- `is_email_verified` = `true`
- `user_id` = authenticated user ID
- `updated_at` = timestamp of verification

## Important Notes

- Verification links expire after the time set in Supabase (default: 24 hours)
- Users can re-register if link expires
- Email verification is mandatory for email/password signup
- Google Sign-In bypasses email verification

## Next Steps

Once email verification is working:
1. Test with multiple email addresses
2. Verify database records are being updated
3. Implement email preferences in user profile
4. Consider adding "Resend verification email" button
