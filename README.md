# FIND Project

A Malawian discovery platform focused on **Find Homes** and **Find/Book a Taxi**, with upcoming services clearly marked as coming soon.

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file from `.env.example` and set the keys below:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`

## Supabase Setup (Backend)

1. **Create a Supabase project**
   - Go to https://supabase.com and create a new project.

2. **Enable Email Auth**
   - In Supabase Dashboard → **Authentication** → **Providers**, enable **Email**.
   - If you disable email confirmations in Supabase while testing, sign-up will work without verification.

3. **Database profile table**
   - Ensure you have a `profiles` table with columns:
     - `user_id` (uuid, primary key)
     - `full_name` (text)

## Google Maps Setup (Taxi Booking)

1. Create a Google Cloud project at https://console.cloud.google.com.
2. Enable the following APIs:
   - **Maps JavaScript API**
   - **Distance Matrix API**
   - **Geocoding API**
3. Create an API key and restrict it to your domain(s).
4. Set the API key in `.env` as `VITE_GOOGLE_MAPS_API_KEY`.

### Taxi Fare Formula
The taxi price is calculated with:

```
Total = (Base fare + Distance (km) × Rate per km) × Passengers
```

The current defaults are:
- Base fare: **1,500 MWK**
- Rate per km: **500 MWK**

These can be adjusted in `src/pages/TaxiBooking.tsx`.

## Vercel Deployment (Free Hosting + Subdomain)

1. Push the repo to GitHub.
2. Go to https://vercel.com and import the GitHub project.
3. In **Environment Variables**, add the same values from `.env`.
4. Deploy.

Vercel automatically provides a **free subdomain** like:

```
https://your-project-name.vercel.app
```

You can rename the project in Vercel to get a clean subdomain.

## Optional: Free Custom Subdomain

If you don’t own a domain, you can still use the free Vercel subdomain above. If you want a custom name (e.g., `findhomes.yourname.dev`), you will need to register a domain. Some providers occasionally offer free domains or trials, but they are not always reliable. The Vercel subdomain is the simplest free option.

## Notes

- Jobs and Roommates are labeled **Coming Soon** while Find Homes and Taxi Booking are active.
- The map-based taxi booking works across Malawi by selecting pickup and destination on the map.
