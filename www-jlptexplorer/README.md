# JLPTExplorer — Frontend

Next.js frontend for JLPTExplorer. Displays grammar points illustrated by YouTube clips from video games and anime.

## Stack

- **Framework:** Next.js (App Router) + React
- **UI:** Mantine
- **i18n:** next-intl (English + French, routes under `app/[lang]/`)
- **Language:** TypeScript
- **Package manager:** yarn

## Getting started

```bash
# 1. Install dependencies
yarn install

# 2. Set up environment
cp .env.example .env
# Edit .env if the backend runs on a different host and port

# 3. Start the dev server
yarn dev            # http://localhost:3000
```

## Dev commands

```bash
yarn dev             # start dev server (http://localhost:3000)
yarn build           # production build
```

## Structure

```
src/
├── app/[lang]/          ← App Router pages (i18n)
├── components/
│   ├── ui/              ← Presentational components
│   ├── layout/          ← Header, Footer, Navbar, Layout
│   └── features/        ← Feature components (grammar/, scenes/, sources/)
├── contexts/            ← React Context providers (settings)
├── hooks/               ← Shared hooks (useApiData, useQueryParam)
├── lib/api/             ← API modules per domain + shared types
├── messages/            ← i18n strings (en.json, fr.json)
├── constants/           ← App-wide constants (JLPT levels)
└── theme.ts             ← Mantine theme config
```
