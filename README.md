# IlyrX Hub — Pro + Supabase

This package is made for GitHub Pages/is-a.dev. It uses Supabase for the parts that GitHub Pages cannot run itself: email/password authentication, PostgreSQL data and realtime chat.

## Setup
1. Create a Supabase project: https://supabase.com/
2. Open SQL Editor and run `supabase.sql`.
3. In Project Settings → API, copy the Project URL and browser-safe Publishable/anon key into `config.js`.
4. In Supabase Authentication settings, set the Site URL/redirect URL to your GitHub Pages URL, for example `https://ilyrx-hub.github.io/ilyrx/`.
5. Upload the files to GitHub Pages. Keep `index.html` as the main page.

Never put a Supabase secret/service_role key in `config.js`.

## What works after configuration
- Register/login with email + password
- Session persistence
- Password reset email
- Online PostgreSQL database
- Realtime community chat
- Browser notification permission
- Profile and sign-out
- Professional developer hub UI

## Email notifications
Supabase Auth can send confirmation/reset/security emails. Custom emails such as “new chat message” require a server-side Edge Function or transactional email provider; secrets must never be placed in browser JS.
