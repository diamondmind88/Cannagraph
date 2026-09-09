# Slice 0 - Foundation

## Goal

Establish the production-quality application foundation without introducing canonical database tables or premature product features.

## Dependencies

- Node.js 22+
- Next.js App Router
- React and strict TypeScript
- Tailwind CSS
- Supabase JavaScript and SSR clients
- Zod boundary validation
- Vitest

## Schema changes

None. Slice 1 owns the first canonical schema migration.

## Routes and components

- Public root route with an archival, evidence-aware visual direction
- Public and workspace route-group boundaries
- Global loading, error, and not-found states
- Badge and card design primitives
- Browser/server Supabase client factories

## Risks

- Public Supabase values must be configured before a client factory is called.
- Service-role or secret keys must never use a `NEXT_PUBLIC_` variable.
- Local Supabase requires Docker, which is not available in every coding workspace.

## Acceptance tests

- Strict TypeScript compilation
- ESLint
- Environment validation unit tests
- Production Next.js build
- CI repeats all checks on pushes and pull requests

## Build report

### Completed

- Strict Next.js foundation
- Environment contract and browser/server Supabase boundaries
- Local Supabase configuration
- Portable standalone container build
- Read-only CI permissions and complete quality workflow
- Premium responsive public shell

### Migrations

None.

### Security and RLS verification

- No database tables exist yet, so RLS is not applicable.
- Only a publishable Supabase key is accepted by client factories.
- No service-role key is declared or referenced.
- CI uses read-only repository contents permission.

### Known limitations

- Canonical schema and RLS begin in Slice 1.
- The workspace could not start the interactive Next.js server because its runtime denied network-interface inspection. The optimized production build succeeded.
- Supabase CLI execution in this workspace attempted to write its global state under a read-only root path. Local services were therefore not started here; `supabase/config.toml` is checked in for a Docker-enabled environment.

## Acceptance quality gate

- Architecture integrity: PASS
- Database integrity: NOT APPLICABLE
- Provenance integrity: NOT APPLICABLE
- Cannabis domain integrity: PASS
- Authorization and security: PASS for foundation scope
- Research worker safety: NOT APPLICABLE
- Search and graph correctness: NOT APPLICABLE
- UI quality: PASS by production compilation and responsive code review; interactive runtime preview blocked as documented
- Accessibility: PASS by semantic and keyboard-focus code review
- Performance: PASS for foundation scope
- Code quality: PASS
- Regression safety: PASS; the repository previously contained no application code
- Community and organization integrity: NOT APPLICABLE

ACCEPTANCE GATE: PASS
