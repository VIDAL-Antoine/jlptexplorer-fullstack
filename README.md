# JLPTExplorer

A Japanese grammar learning app (inspired by Bunpro) focused on contextual examples from various Japanese sources. Each grammar point (JLPT N5–N1) is illustrated by YouTube clips showing the grammar in real use.

## Stack

- **Frontend:** Next.js 16 + React 19 + Mantine 8 + next-intl — `yarn`
- **Backend:** Fastify 5 + Prisma 7 + PostgreSQL + Zod — `npm`
- **Database:** PostgreSQL

## Getting started

```bash
# Backend
cd backend
npm install
npm run db:generate
npm run dev         # http://localhost:8080

# Frontend (separate terminal)
cd frontend
yarn install
yarn dev            # http://localhost:3000
```

## Packages

- [`frontend/`](./frontend) — Next.js app
- [`backend/`](./backend) — Fastify API
