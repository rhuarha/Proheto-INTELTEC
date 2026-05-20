# INTELTEC - Sistema de Controle de Produção

## Overview

Full-stack production control system for INTELTEC, built as a pnpm monorepo. The system manages production orders through 6 stages: Recebimento, Processamento, Impressão, Envelopamento, Embalagem, Retirada.

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
| cliente | cliente@teste.com.br | cliente123 |

## Module Structure

### Frontend Pages (artifacts/inteltec/src/pages/)
- `/login` — Login page (JWT auth)
- `/dashboard` — Production overview with stats (ordensRetiradasHoje)
- `/recebimento` — Register new production orders (with hora)
- `/processamento` — Manage orders, add items, price validation warning
- `/impressao` — Mark items as printed
- `/envelopamento` — Mark items as enveloped
- `/embalagem` — Mark items as packed
- `/retirada` — Confirm client pickup by order (replaces Despacho)
- `/minhas-ordens` — Client view (own orders only)
- `/admin/usuarios` — User management (admin)
- `/admin/clientes` — Client management (admin)
- `/admin/produtos` — Product management (admin, includes exigeProcessamento)
- `/admin/precos` — Price management per client/product (admin + apontador)

### API Routes (artifacts/api-server/src/routes/)
- `auth.ts` — POST /auth/login, GET /auth/me
- `users.ts` — CRUD users
- `clientes.ts` — CRUD clients
- `produtos.ts` — CRUD products (exigeProcessamento field)
- `producao.ts` — Production orders + items + stage endpoints (recalcularStatusProducao)
- `precos.ts` — CRUD prices per client+product, GET /precos/vigente
- `dashboard.ts` — Summary (ordensRetiradasHoje) and pending counts (retirada)

### Database Schema (lib/db/src/schema/)
- `clientes.ts` — clientes table (expanded: ~30 fields including juridica, endereço, emails, faturamento, fechamento)
- `users.ts` — users table (references clientes)
- `produtos.ts` — produtos table (exigeProcessamento boolean)
- `producao.ts` — producao table (horaRecebimento added, lowercase status enum)
- `producaoItems.ts` — producao_item table (retirado field, multiplicador integer)
- `clienteProdutoPreco.ts` — cliente_produto_preco table (new)
- `logs.ts` — logs table

### Clientes Table — Full Field Reference
Identification: `nomeRazaoSocial`, `nomeFantasia`, `nomeInterno`, `juridica`, `cnpjCpf`, `inscrEstadual`, `inscrMunicipal`, `telefone`
Address: `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `cep`, `uf`
Emails: `emailNfse`, `nomeContato`, `emailContato`, `emailAprovaDemonstrativo`, `emailInformaProdutoEmbalado`
Billing: `tipoFaturamento` (N/R), `emiteBoleto`, `exigeDemonstrativo`, `pedidoCompra`, `prazoPagamento`
Closing: `tipoFechamento` (IMEDIATO/POR_VALOR/POR_VALOR_OU_PRAZO/POR_PRAZO/MENSAL_FIXO), `valorAlvo`, `valorMinimo`, `prazoMaximoDias`, `diaFechamento`, `fecharAoDisponibilizar`
Misc: `diretorioProducao`, `diretorioDemonstrativo`, `ativo`, `deletedAt`

### Shared Frontend Utilities (artifacts/inteltec/src/lib/date.ts)
- `formatLocalDate(dateStr)` — timezone-safe date display (splits YYYY-MM-DD directly, no UTC conversion)
- `nomeCliente(cliente)` — prefers `nomeInterno` → `nomeFantasia` → `nomeRazaoSocial`

## Production Order Status Flow

```
recebida → processada → impressa → envelopada → embalada → retirada
                                                               ↓
                                                          cancelada
```

All status values are lowercase. Transitions are calculated by `recalcularStatusProducao()` in `producao.ts` based on item flags.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Seeds / Carga Inicial de Dados

### Seed de Clientes

Insere ou atualiza registros de clientes. Usa upsert baseado em `cnpj_cpf` (preferencial) ou `nome_interno`.

```bash
pnpm --filter @workspace/db run seed:clientes
```

O script está em `lib/db/src/seeds/seed-clientes.ts`. Para adicionar novos clientes, edite o array `clientes` no arquivo e execute o comando acima. Registros já existentes são atualizados; novos são inseridos.

## Important Notes

- JWT tokens stored in localStorage as `inteltec_token`
- `setAuthTokenGetter` is called at app startup to inject auth headers automatically
- Role-based route protection: admin/apontador see production stages, cliente sees only their orders
- Cadastros dropdown in nav is now visible to both admin and apontador; Preços accessible to both
- Price validation: after adding an item in processamento, if no vigente price exists, a warning form appears inline
- No physical deletion — soft delete pattern where applicable
- All actions are logged to the `logs` table
- `usaPapel` enum values are only "B" (Branco) and "I" (Impresso próprio) — no "N" in the generated type; UI displays "Branco" (not "Bobina")
- Processamento ordering: when listing with `status=recebida`, orders sorted by `dataRecebimento ASC, horaRecebimento ASC, id ASC` (FIFO)
- "Total" column removed from all production stage screens (impressao, envelopamento, embalagem, retirada, processamento)
- All production screens display `nomeCliente()` helper (prefers nomeInterno over nomeFantasia over nomeRazaoSocial)
- All date displays use `formatLocalDate()` to avoid UTC timezone shifting (common bug with Brazilian UTC-3)
