# Fotmatic.app domain setup (Option B: one project, two domains)

## What is middleware? (simple terms)

**Middleware** is code that runs **before** every request hits your pages. Think of it like a receptionist at the front door:

- Every time someone requests a URL (e.g. `fotmatic.app/bookings`), the request goes to the receptionist first.
- The receptionist can:
  - **Let them through unchanged** — the request goes to the normal page (e.g. graddrive.com/dashboard).
  - **Rewrite** — send them to a different internal “room” (e.g. serve `/photographer-admin/bookings`) but **keep the address on their badge** (the browser URL stays `capsnap.app/bookings`). The user doesn’t see a redirect.
  - **Redirect** — tell them “please go to this other address” (the browser URL changes, e.g. from `capsnap.app/photographer-admin/dashboard` to `capsnap.app/dashboard`).

In this project we use middleware only for **fotmatic.app** (and www). For those hosts we rewrite so that `fotmatic.app/` and `fotmatic.app/dashboard`, etc., serve the photographer-admin app, while the URL bar still shows the short, clean Fotmatic URLs. On **graddrive.com** the receptionist does nothing and requests go through as usual.

---

This project serves the **photographer-admin** app at two places:

- **graddrive.com/photographer-admin** — for admins who switch into “photographer view” (stays on GradDrive).
- **fotmatic.app** — for photographers; the app appears as its own site (same codebase, same Firebase).

## 1. Vercel: add fotmatic.app to the same project

1. Open your **Vercel** project (the one that already has **graddrive.com**).
2. Go to **Settings → Domains**.
3. Click **Add** and enter:
   - `fotmatic.app`
   - (Optional) `www.fotmatic.app` if you want that too.
4. Vercel will show the DNS records you need (e.g. **A** or **CNAME**). Leave this tab open.

## 2. DNS: point fotmatic.app to Vercel

At the registrar where you bought **fotmatic.app**:

- Add the **A** or **CNAME** record(s) that Vercel shows (e.g. `CNAME fotmatic.app → cname.vercel-dns.com` or the A record they give).
- If you added **www.fotmatic.app**, add the **www** record Vercel shows.

Wait until the domain is verified in Vercel (usually a few minutes).

## 3. Firebase: authorized domains for Auth

Firebase Auth only allows sign-in on domains you list. Add both domains:

1. Open [Firebase Console](https://console.firebase.google.com/) → your **GradDrive** project.
2. Go to **Authentication → Settings** (or **Sign-in method** tab) and find **Authorized domains**.
3. Add:
   - `graddrive.com`
   - `www.graddrive.com` (if you use it)
   - `fotmatic.app`
   - `www.fotmatic.app` (if you use it)
   - `localhost` is already there for local dev.

Without this, sign-in (e.g. Google) will be blocked on the new domain.

## 4. What the code does (no extra config)

- **Middleware** (`middleware.ts`): For requests to **fotmatic.app** (or www), it rewrites so that:
  - `fotmatic.app/` → serves `/photographer-admin`
  - `fotmatic.app/dashboard` → serves `/photographer-admin/dashboard`
  - `fotmatic.app/bookings` → serves `/photographer-admin/bookings`
  - etc.  
  If someone visits `capsnap.app/photographer-admin/...`, they are redirected to the clean URL (e.g. `capsnap.app/dashboard`).

- **Base path** (`usePhotographerBasePath`): Links in the photographer app use:
  - On **fotmatic.app**: `/dashboard`, `/bookings`, etc. (clean URLs).
  - On **graddrive.com**: `/photographer-admin/dashboard`, `/photographer-admin/bookings`, etc.

Admins who use “Switch to Photographer Admin View” always go to **graddrive.com/photographer-admin** and stay on the GradDrive domain.

## Summary checklist

- [ ] Vercel: **fotmatic.app** (and optionally **www.fotmatic.app**) added to the same project as graddrive.com.
- [ ] DNS: A/CNAME for **fotmatic.app** (and **www** if used) pointing to Vercel.
- [ ] Firebase: **graddrive.com**, **www.graddrive.com**, **fotmatic.app**, **www.fotmatic.app** in **Authorized domains**.

After that, no code changes are required for deployment; the same build serves both domains.

### Adding new photographer routes later

If you add new photographer-admin routes (e.g. `/photographer-admin/settings`), add the corresponding **clean** path to the middleware matcher in `middleware.ts` (e.g. `'/settings'`) so that `fotmatic.app/settings` is rewritten to `/photographer-admin/settings`. Use `usePhotographerBasePath()` for any new links in the photographer app so URLs stay correct on both domains.
