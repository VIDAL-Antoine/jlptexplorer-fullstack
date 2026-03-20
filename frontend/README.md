# JLPTExplorer — Frontend

Next.js frontend for JLPTExplorer. Displays grammar points illustrated by YouTube clips from video games and anime.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **UI:** Mantine 8 + Tabler Icons
- **i18n:** next-intl (English + French, routes under `app/[lang]/`)
- **Language:** TypeScript 5.9
- **Package manager:** yarn 4
- **Testing:** Jest + React Testing Library
- **Storybook:** component development

## Dev commands

```bash
yarn dev             # start dev server (http://localhost:3000)
yarn build           # production build
yarn test            # lint + typecheck + jest
yarn jest            # run tests only
yarn storybook       # component dev server
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
