# JLPTExplorer — Backend

Fastify REST API for JLPTExplorer, serving grammar points, scenes, sources, speakers, and transcript lines with grammar annotations.

## Stack

- **Framework:** Fastify 5
- **ORM:** Prisma 7 + `@prisma/adapter-pg` (PostgreSQL)
- **Validation:** Zod
- **API docs:** Swagger UI (available at `/docs` in dev)
- **Language:** TypeScript
- **Package manager:** npm

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env variables:
#   DATABASE_URL   - PostgreSQL connection string (used by Prisma)
#   FRONTEND_URL   - origin allowed by CORS
#   ADMIN_API_KEY  - secret key required in the X-Api-Key header for admin routes

# 3. Generate Prisma client
npm run db:generate

# 4. Apply migrations
npm run db:migrate

# 5. (Optional) Seed the database
npm run db:seed

# 6. Start the dev server
npm run dev         # http://localhost:8080
```

## Dev commands

```bash
npm run dev          # start with hot reload (http://localhost:8080)
npm run build        # compile TypeScript to dist/
npm run db:generate  # regenerate Prisma client after schema changes
npm run db:migrate   # create and apply a migration
npm run db:push      # push schema changes without migration (dev only)
npm run db:studio    # open Prisma Studio
```

## Structure

```
src/
├── index.ts            ← Fastify entry (port 8080)
├── config/prisma.ts    ← PrismaClient singleton
├── plugins/            ← Fastify plugins (cors, swagger, etc.)
├── routes/v1/          ← Route registration (public + admin per resource)
├── controllers/        ← HTTP request/response handlers
├── services/           ← Business logic
├── repositories/       ← Data access (Prisma queries)
├── schemas/            ← Zod validation schemas
└── utils/              ← Shared utilities
prisma/
├── schema/             ← Multi-file schema (one file per domain)
└── migrations/
prisma.config.ts        ← Prisma v7 datasource config
```

## API

Base URL: `http://localhost:8080/api/v1`

Public routes (read-only) are locale-scoped: `/{locale}/scenes`, `/{locale}/grammar-points`, `/{locale}/sources`, `/{locale}/speakers`, `/{locale}/transcript-lines`.

Admin routes (CRUD) are global: `/scenes`, `/sources`, `/speakers`, `/transcript-lines`, `/transcript-line-grammar-points`.

Full interactive docs available at `http://localhost:8080/docs`.
