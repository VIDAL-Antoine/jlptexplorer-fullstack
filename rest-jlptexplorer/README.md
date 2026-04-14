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
│   ├── filters/prisma-exception.filter.ts
│   └── interceptors/strip-timestamps.interceptor.ts
├── sources/                             ← controller / service / repository / dto
├── scenes/
├── grammar-points/
├── speakers/
├── transcript-lines/
├── transcript-line-grammar-points/
└── utils/                               ← parse-time
prisma/
├── schema/                              ← Multi-file schema (one file per domain)
└── migrations/
prisma.config.ts                         ← Prisma v7 datasource config
```

## API

Base URL: `http://localhost:8080/api/v1`

Public routes (read-only, no auth):

| Method | Path | Notes |
|--------|------|-------|
| GET | `/sources` | filterable by `type` |
| GET | `/sources/{slug}` | |
| GET | `/sources/{slug}/scenes` | filterable by `grammar_points`, `grammar_match` |
| GET | `/scenes` | filterable by `sources`, `grammar_points`, `grammar_match`, `youtube_video_id` |
| GET | `/scenes/{id}` | |
| GET | `/grammar-points` | filterable by `jlpt_level`, `search` |
| GET | `/grammar-points/{slug}` | |
| GET | `/grammar-points/{slug}/scenes` | |
| GET | `/speakers` | |
| GET | `/speakers/{slug}` | |
| GET | `/transcript-lines` | filterable by `scene_id`, `speaker_slug`, `grammar_points` |
| GET | `/transcript-lines/{id}` | |

Admin routes (require `x-api-key` header): POST, PUT, PATCH, DELETE on all resources above, plus all routes on `/transcript-line-grammar-points` (fully admin-only).

Full interactive docs: `http://localhost:8080/docs`
