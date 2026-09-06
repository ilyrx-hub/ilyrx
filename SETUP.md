# IlyrX Complete Setup

## What this package provides

This is a professional game-download + developer-hub frontend inspired by the structure of modern hosting sites:
- Game catalog and filters
- Hosting features
- Developer tools/resources
- Downloads area
- Network status UI
- Client login/register
- Password reset
- Supabase database
- Realtime chat
- Browser notification permission
- Mobile responsive UI

## 1. Supabase

Create a project at https://supabase.com/

Open **SQL Editor** and run `supabase.sql`.

Then open `config.js` and replace:
- `YOUR-PROJECT`
- `YOUR_PUBLISHABLE_KEY`

Only use the browser-safe Publishable/anon key. Never expose `service_role` or secret keys.

## 2. Authentication

In Supabase Authentication settings:
- set Site URL to your GitHub Pages URL
- add your custom is-a.dev URL when it is live
- enable email confirmation if you want verification

Example:
`https://ilyrx-hub.github.io/ilyrx/`

## 3. Realtime chat

`supabase.sql` creates:
- profiles
- messages
- notifications
- RLS policies
- a realtime publication entry for messages

The frontend subscribes to new messages in realtime.

## 4. Real hosting orders

The game cards currently are safe frontend placeholders. They do NOT pretend to create servers.

To actually provision servers, connect the buttons to a real hosting backend/API (for example a panel such as Pterodactyl plus your own server-side API). Keep all provider API tokens on the server, never in `app.js`.

## 5. Email notifications

Supabase Auth can send confirmation/password-reset emails.

For custom notifications such as "support replied to your ticket", add a server-side/Edge Function email provider. Never put an SMTP/API secret in browser JavaScript.

## 6. is-a.dev

The website can remain on GitHub Pages. Your `domains/ilyrx.json` is separate from this website and should contain only the DNS configuration required by is-a.dev.


## 7. Client Area

The new client area includes:
- Overview and account summary
- My Servers
- Orders
- Support tickets
- Downloads
- Notifications
- Profile/sign out
- Quick actions
- System status

The frontend is complete, but **real server provisioning, payments, and ticket persistence require a backend**. Do not place provider secrets in browser JavaScript.

## 8. Recommended production architecture

GitHub Pages:
- static frontend only

Supabase:
- Auth
- PostgreSQL
- Realtime chat
- tickets/orders/notifications data

Server-side API / Edge Functions:
- payment webhooks
- server provisioning
- hosting provider API calls
- private secrets
- custom email notifications


## Download Hub setup

The game cards are intentionally download-focused. Replace each demo button with your actual:
- direct download URL
- GitHub release
- official game page
- launcher/download page

For copyrighted commercial games, use official/legal distribution sources and do not host unauthorized game copies, cracks or pirated installers.

The client area can later store download history and favorites in Supabase.
