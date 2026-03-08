# JLPTExplorer — CLAUDE.md

## Language

All code, comments, variable names, commit messages, and file names must be written in **English**. Conversations with Claude may be in French.

## Project overview

JLPTExplorer is a Japanese grammar learning app similar to Bunpro, but focused on contextual examples from video games and anime. Each grammar point (JLPT N5–N1) is illustrated by YouTube video clips extracted from games or anime, showing the grammar in real use.

## Tech stack

### Frontend (`/frontend`)

- **Framework:** Next.js 16 (App Router) + React 19
- **UI:** Mantine 8 + Tabler Icons
- **Language:** TypeScript 5.9
- **Package manager:** yarn 4
- **Testing:** Jest + Testing Library
- **Storybook:** for component development
- **Linting:** ESLint + Stylelint + Prettier

### Backend (`/backend`)

- **Framework:** Fastify 5
- **ORM:** Prisma 7 (multi-file schema, `@prisma/adapter-pg`)
- **Database:** PostgreSQL (local)
- **Language:** TypeScript (CommonJS, compiled to `dist/`)
- **Package manager:** npm
- **Dev runner:** tsx watch

## Project structure

```
jlptexplorer-fullstack/
├── frontend/
│   ├── app/                    ← Next.js App Router (pages, layouts)
│   ├── components/             ← Reusable UI components
│   │   └── ComponentName/
│   │       ├── ComponentName.tsx
│   │       ├── ComponentName.test.tsx
│   │       ├── ComponentName.story.tsx
│   │       └── ComponentName.module.css
│   ├── test-utils/             ← Test helpers
│   └── theme.ts                ← Mantine theme config
└── backend/
    ├── src/
    │   ├── index.ts            ← Fastify server entry (port 8080)
    │   ├── lib/
    │   │   └── prisma.ts       ← PrismaClient singleton
    │   ├── plugins/            ← Fastify plugins (cors, etc.)
    │   └── routes/             ← Route handlers par ressource
    │       ├── clips/
    │       ├── grammar-points/
    │       └── sources/
    ├── prisma/
    │   ├── schema/
    │   │   ├── base.prisma     ← generator + datasource
    │   │   ├── clip.prisma
    │   │   ├── source.prisma
    │   │   └── grammar.prisma
    │   └── migrations/
    └── prisma.config.ts        ← Prisma v7 config (datasource URL)
```

## Key architectural decisions

- **Prisma v7** requires `@prisma/adapter-pg` for direct PostgreSQL connections — no `url` in schema files, configured via `prisma.config.ts`
- **Multi-file Prisma schema** in `prisma/schema/` (one file per domain)
- **Generated client** in `src/generated/prisma/` (gitignored, rebuild with `npm run db:generate`)
- Always use `npm run db:*` scripts instead of `npx prisma` directly (ensures local Prisma version is used)

## Dev commands

### Backend

```bash
npm run dev          # start with hot reload (tsx watch)
npm run build        # compile TypeScript
npm run db:generate  # regenerate Prisma client after schema changes
npm run db:migrate   # create and apply a migration
npm run db:push      # push schema changes without migration (dev only)
npm run db:studio    # open Prisma Studio
```

### Frontend

```bash
yarn dev             # start Next.js dev server
yarn build           # production build
yarn test            # lint + typecheck + jest
yarn jest            # run tests only
yarn storybook       # component dev
```

## Git conventions

### Commit format

```
type(scope): description
```

- Lowercase, no period at end
- **Types:** `feat`, `fix`, `refactor`, `chore`, `docs`
- **Scopes:** `frontend`, `backend` (omit if both are affected)

### Branches

Never commit directly to `main`. Branch format:

```
type-NNNNN/branch-description
```

Example: `feat-00003/setup-prisma-models`

Use git switch and never git checkout. `git switch -C` allows you to create a branch and switch to it while `git switch` switches to a branch.
