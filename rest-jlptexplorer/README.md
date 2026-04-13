# JLPTExplorer — NestJS Backend

NestJS REST API for JLPTExplorer, serving grammar points, scenes, sources, speakers, and transcript lines with grammar annotations.

## Stack

- **Framework:** NestJS 11 (Express platform)
- **ORM:** Prisma 7 + `@prisma/adapter-pg` (PostgreSQL)
- **Validation:** class-validator + class-transformer (global ValidationPipe)
- **API docs:** Swagger UI (available at `/docs` in dev)
- **Auth:** `x-api-key` header guard on all admin routes
- **Testing:** Jest (unit tests with mocked dependencies)
- **Language:** TypeScript
- **Package manager:** npm

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env variables:
#   DATABASE_URL   - PostgreSQL connection string
#   PORT           - port used by the API
#   FRONTEND_URL   - origin allowed by CORS
#   ADMIN_API_KEY  - secret key required in the x-api-key header for admin routes

# 3. Generate Prisma client
npm run db:generate

# 4. Apply migrations
npm run db:migrate

# 5. (Optional) Seed the database
npm run db:seed

# 6. Start the dev server
npm run start:dev   # http://localhost:8080
```

## Dev commands

```bash
npm run start:dev    # start with hot reload (http://localhost:8080)
npm run build        # compile TypeScript
npm run test         # run unit tests
npm run lint         # eslint with auto-fix
npm run db:generate  # regenerate Prisma client after schema changes
npm run db:migrate   # create and apply a migration
npm run db:push      # push schema changes without migration (dev only)
npm run db:studio    # open Prisma Studio
```

## Structure

```
src/
├── main.ts                              ← NestJS entry (port 8080, global prefix api/v1)
├── app.module.ts                        ← Root module
├── prisma/                              ← @Global PrismaService (PrismaPg adapter)
├── common/
│   ├── guards/api-key.guard.ts          ← x-api-key header guard
│   └── filters/prisma-exception.filter.ts
├── sources/                             ← controller / service / repository / dto
├── scenes/
├── grammar-points/
├── speakers/
├── transcript-lines/
├── transcript-line-grammar-points/
└── utils/                               ← parse-time, flatten
prisma/
├── schema/                              ← Multi-file schema (one file per domain)
└── migrations/
prisma.config.ts                         ← Prisma v7 datasource config
```

## API

Base URL: `http://localhost:8080/api/v1`

Public routes (read-only, no auth) are locale-scoped:

| Method | Path |
|--------|------|
| GET | `/{locale}/sources` |
| GET | `/{locale}/sources/{slug}` |
| GET | `/{locale}/sources/{slug}/scenes` |
| GET | `/{locale}/scenes` |
| GET | `/{locale}/scenes/{id}` |
| GET | `/{locale}/grammar-points` |
| GET | `/{locale}/grammar-points/{slug}` |
| GET | `/{locale}/grammar-points/{slug}/scenes` |
| GET | `/{locale}/speakers` |
| GET | `/{locale}/speakers/{slug}` |
| GET | `/{locale}/transcript-lines` |
| GET | `/{locale}/transcript-lines/{id}` |

Admin routes (require `x-api-key` header): POST, PUT, PATCH, DELETE on `/sources`, `/scenes`, `/grammar-points`, `/speakers`, `/transcript-lines`, `/transcript-line-grammar-points`.

Full interactive docs: `http://localhost:8080/docs`
