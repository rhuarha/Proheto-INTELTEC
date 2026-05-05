# INTELTEC - Sistema de Controle de Produção

## Overview

Full-stack production control system for INTELTEC, built as a pnpm monorepo. The system manages production orders through 6 stages: Recebimento, Processamento, Impressão, Envelopamento, Embalagem, Despacho.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/inteltec) — served at `/`
- **API framework**: Express 5 (artifacts/api-server) — served at `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs — manual local auth (no auth provider)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API server)

## User Roles & Test Credentials

| Role | Email | Password |
|------|-------|----------|
| admin | admin@inteltec.com.br | admin123 |
| apontador | apontador@inteltec.com.br | apontador123 |
| cliente | cliente@graficasp.com.br | cliente123 |

## Module Structure

### Frontend Pages (artifacts/inteltec/src/pages/)
- `/login` — Login page (JWT auth)
- `/dashboard` — Production overview with stats
- `/recebimento` — Register new production orders
- `/processamento` — Manage orders and add items
- `/impressao` — Mark items as printed
- `/envelopamento` — Mark items as enveloped
- `/embalagem` — Mark items as packed
- `/despacho` — Mark items as dispatched
- `/minhas-ordens` — Client view (own orders only)
- `/admin/usuarios` — User management (admin)
- `/admin/clientes` — Client management (admin)
- `/admin/produtos` — Product management (admin)

### API Routes (artifacts/api-server/src/routes/)
- `auth.ts` — POST /auth/login, GET /auth/me
- `users.ts` — CRUD users
- `clientes.ts` — CRUD clients
- `produtos.ts` — CRUD products
- `producao.ts` — Production orders + items + stage endpoints
- `dashboard.ts` — Summary and pending counts

### Database Schema (lib/db/src/schema/)
- `clientes.ts` — clientes table
- `users.ts` — users table (references clientes)
- `produtos.ts` — produtos table
- `producao.ts` — producao table (references clientes)
- `producaoItems.ts` — producao_item table
- `logs.ts` — logs table

## Production Order Status Flow

```
RECEBIDA → EM_PROCESSAMENTO → PROCESSADA → EM_PRODUCAO → EMBALADA → FINALIZADA
                                                                 ↓
                                                           CANCELADA
```

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Important Notes

- JWT tokens stored in localStorage as `inteltec_token`
- `setAuthTokenGetter` is called at app startup to inject auth headers automatically
- Role-based route protection: admin/apontador see production stages, cliente sees only their orders
- No physical deletion — soft delete pattern where applicable
- All actions are logged to the `logs` table

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
