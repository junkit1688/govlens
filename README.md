# GovLens

GovLens is a civic-tech web application for exploring Malaysian government spending, public projects, community petitions, voting, forums, and citizen reports.

Live site: https://junkit1688.github.io/govlens/

## Features

- Interactive Malaysia spending map
- State-level budget and project dashboards
- Citizen petitions with progress tracking
- Public voting on community issues
- Community forum for civic discussion
- Citizen reporting for infrastructure and local issues
- Report image upload preview for new reports
- Supabase Auth for login and account creation
- Supabase database storage for reports, petitions, signatures, forum posts, votes, and notifications
- Browser speech-to-text input for long form fields using the Web Speech API
- Animated dashboard UI with collapsible navigation

## Tech Stack

- TypeScript
- React
- Vite
- Tailwind CSS
- Framer Motion
- Wouter
- Recharts
- Lucide React
- Supabase
- Browser Web Speech API

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the schema in:

```text
supabase/schema.sql
```

4. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

5. Add your Supabase project values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not commit `.env`. It is already ignored by `.gitignore`.

The app uses Supabase Auth when these variables are present. If they are missing, GovLens falls back to local prototype accounts so the UI can still be demonstrated without backend credentials.

For the easiest classroom demo flow, open Supabase `Authentication` -> `Sign In / Providers` -> `Email` and turn off email confirmation. If email confirmation stays on, newly created users are saved in Supabase but must confirm their email before they can log in again.

GovLens also includes a `demo_accounts` table for classroom login demos. It lets an account created in one browser be used from another browser without waiting for Supabase Auth email confirmation. Run `supabase/schema.sql` again if this table is missing.

For shared classroom demo content, also run `supabase/demo-civic-data.sql`. It creates public demo tables for reports, petitions, petition signatures, forum posts, and votes so data submitted by one browser appears for other users.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local site:

```text
http://localhost:3000
```

## Scripts

Run type checks:

```bash
npm run check
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

This repository also includes `pnpm-lock.yaml`, so `pnpm install` and `pnpm dev` work for contributors who prefer pnpm.

## GitHub Pages

This project is deployed with GitHub Pages using GitHub Actions.

The production site is served from:

```text
https://junkit1688.github.io/govlens/
```

When building for GitHub Pages, the app uses `/govlens/` as the base path.

## HCI Assignment Notes

- Real backend features: Supabase email/demo account login, reports insert/delete, petitions insert/delete, petition signatures insert, forum posts insert/delete, votes insert, and notification fetch.
- Prototype/fallback features: mock state spending data, seeded petitions/forum/reports/voting data, and local fallback auth when Supabase env vars are absent.
- Audio technique: Web Speech API microphone buttons are available on petition descriptions, forum post content, and citizen report descriptions. Unsupported browsers show an error message instead of breaking the form.
- Visual technique: the existing Malaysia spending map remains the interactive visual data map. A future Mapbox GL JS/WebGL integration can be added if a Mapbox token and scope are available, but it is intentionally not required for the current stable assignment build.

Submitted Supabase data is stored in PostgreSQL. Mock data remains visible to make the classroom prototype useful before the database has records.
