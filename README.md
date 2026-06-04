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

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local site:

```text
http://localhost:3000
```

## Scripts

Run type checks:

```bash
pnpm check
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## GitHub Pages

This project is deployed with GitHub Pages using GitHub Actions.

The production site is served from:

```text
https://junkit1688.github.io/govlens/
```

When building for GitHub Pages, the app uses `/govlens/` as the base path.

## Notes

The current data is mock/simulated and is intended for prototype, portfolio, and demonstration purposes.

Reports submitted in the browser are currently local to the visitor session. A backend/database such as Supabase or Firebase is needed if reports should be visible to everyone.
