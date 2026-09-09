# Cannagraph

Cannagraph is an evidence-aware cannabis genetics research platform. PostgreSQL is the canonical data store; substantial historical and genetic assertions will be represented as claims tied to source evidence.

## Foundation

- Next.js App Router with strict TypeScript
- Tailwind CSS design tokens and accessible primitives
- Supabase browser/server boundaries using publishable credentials only
- Zod environment validation
- Local Supabase configuration
- CI quality gate for typecheck, lint, tests, and production build
- Standalone container deployment configuration

## Local development

1. Copy `.env.example` to `.env.local` and add the project's public Supabase URL and publishable key.
2. Install dependencies with `npm ci`.
3. Start the web app with `npm run dev`.
4. Start local Supabase with `npx supabase start` when Docker and the Supabase CLI are available.

Never expose a Supabase service-role or secret key in `NEXT_PUBLIC_*` variables.

Build a production container with `docker build -t cannagraph .` when Docker is available.

## Build discipline

Implement one numbered slice from the master handoff at a time. Every accepted slice must pass typecheck, lint, tests, production build, and its applicable acceptance gates before expansion.

## Canonical database

Slice 1 migrations, security boundaries, and verification criteria are documented in
[`docs/slice-1-canonical-database.md`](docs/slice-1-canonical-database.md).
