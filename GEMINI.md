# Syiar Gemilang - Project Instructions

## Architecture & Conventions
- **Backend**: NestJS
  - Use Prisma for ORM.
  - Database: MySQL (UUID for IDs).
  - API Prefix: `/api/v1`.
  - Global Validation: Always use `ValidationPipe` with DTOs.
  - Audit Logs: Handled via `AuditInterceptor` in `common/interceptors`.
  - Pagination: Use `PaginationDto` in `common/dto`.
- **Frontend**: Next.js
  - Styling: Prefer Vanilla CSS.
  - State Management: Keep it simple, use React hooks or Context if needed.

## Workflow
- Always follow the `planCLI.md` for feature implementation order.
- Ensure `audit_logs` are correctly populated for any mutation.
- Maintain strict modularity in the NestJS backend.

## Database
- MySQL port in Docker: `3306` (Internal), `3307` (External Host).
- Database Name: `syiar_gemilang`.
- Migrations: Use Prisma Migrate.
- Seeding: Use `prisma/seed.ts` (Run with `npx prisma db seed`).
