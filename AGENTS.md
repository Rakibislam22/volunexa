<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Volunexa Frontend — Agent Instructions & Architecture

## Design & Theme Guidelines
- **Primary Color:** `#00494B` (Deep Emerald / Forest Teal)
- **Primary Hover:** `#00383a`
- **Secondary / Accent Color:** `#FF4B72` (Vibrant Coral/Pink as inspired by the hero action button in `Theme_Image.png`)
- **Theme Aesthetics:** Clean, modern, accessible, responsive (Desktop, Tablet, Mobile) with dark mode toggle.
- **Hero Section:** Dark ambient backdrop with subtle teal glow, high-contrast headline, pill-shaped unified search bar (Search Keyword + Location + Category + Search Button), and quick filter chips ("Upcoming Events", "Featured Events", "All Events").

## Realtime Architecture (Socket.IO)
- Socket client connected to `NEXT_PUBLIC_API_URL` or `http://localhost:5000`.
- Listens to:
  - `slots:updated`: Realtime available volunteer slot counter updates on event cards and details page.
  - `event:created`: Instantly adds new events to listings without refresh.
  - `event:updated`: Updates capacity, details, and status.
  - `registration:new`: Realtime notification to organizer when a volunteer registers.
  - `registration:statusChanged`: Realtime notification to volunteer when their status is changed.
  - `registration:cancelled`: Realtime slot increment and cancellation alert.

## Roles & Route Protection
- **Public:** `/`, `/events`, `/events/[id]`, `/login`, `/register`
- **Organizer:** `/organizer/dashboard`, `/organizer/create-event`, `/organizer/events`, `/organizer/volunteers/[id]`, `/organizer/analytics`
- **Volunteer:** `/volunteer/dashboard`, `/volunteer/my-events`, `/volunteer/favorites`, `/volunteer/profile`

## Key Feature Checklist
1. **Organizer Capabilities:**
   - Event creation with title, description, date, location, category, max capacity, skills, registration deadline.
   - AI Event Description Assistant (Gemini powered with mock fallback).
   - Event management (edit, delete, close registration, publish).
   - Volunteer status management (Registered, Confirmed, Attended, Cancelled).
   - Recharts visual analytics (Events by category, Volunteer registrations, Capacity utilization).
2. **Volunteer Capabilities:**
   - Browse events with search & category/location/date filters.
   - Register for events with capacity guard & deadline guard & duplicate prevention.
   - Real-time remaining slots counter.
   - My Events management (view status, cancel before event date).
   - Favorites bookmarking.
   - Volunteer profile with skills, bio, interests.
   - QR Code generation for check-in.
   - Event link sharing.
