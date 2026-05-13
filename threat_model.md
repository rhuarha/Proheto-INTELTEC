# Threat Model

## Project Overview

INTELTEC is a production-control system for managing customer production orders across multiple fulfillment stages. The production deployment consists of a React/Vite frontend in `artifacts/inteltec` and an Express 5 API in `artifacts/api-server` backed by PostgreSQL via Drizzle ORM. Authentication is handled locally with email/password, bcrypt password hashes, and JWT bearer tokens. Per scan assumptions, production runs with `NODE_ENV=production`, traffic is terminated over platform-managed TLS, and the mockup sandbox is not deployed to production.

## Assets

- **User accounts and bearer tokens** — user emails, bcrypt password hashes, JWT signing key material, and active bearer tokens. Compromise enables impersonation across admin, apontador, and cliente roles.
- **Customer master data** — the `clientes` records contain tax IDs, addresses, billing preferences, internal directory fields, and multiple contact emails. Exposure would leak sensitive business and personal data across customers.
- **Production orders and item history** — `producao` and `producao_item` records reveal customer relationships, order timing, workflow state, and fulfillment progress. Unauthorized access exposes other customers’ operational data.
- **Commercial pricing data** — `cliente_produto_preco` stores customer-specific prices and validity windows. Exposure can leak negotiated pricing between customers.
- **Application secrets and infrastructure access** — database connection strings and `SESSION_SECRET`/JWT signing secret determine whether the API can be trusted to authenticate requests.
- **Audit logs** — the `logs` table records user-driven changes and is important for accountability around production and admin operations.

## Trust Boundaries

- **Browser → API** — all frontend input crosses into the Express API. The browser is untrusted and all authentication, authorization, and validation must be enforced server-side.
- **API → PostgreSQL** — the API has broad access to business data. Any access-control flaw or injection in route handlers can expose or modify the full dataset.
- **Public → Authenticated boundary** — `/api/auth/login` and `/api/healthz` are public; the rest of the production API is intended to be authenticated. Public endpoints need abuse protections and must not reveal sensitive information.
- **Authenticated → privileged staff boundary** — `admin` and `apontador` users operate most workflow and management endpoints, while `cliente` users should be restricted to their own data. This boundary is the highest-risk authorization surface in the app.
- **Configured production secret → insecure fallback boundary** — authentication integrity depends on deployment secrets being present. Code paths that silently fall back to embedded defaults collapse this boundary.
- **Production → dev-only boundary** — `artifacts/mockup-sandbox` is development-only under the current threat model and should be ignored unless production reachability is demonstrated.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/*.ts`, `artifacts/inteltec/src/main.tsx`, `artifacts/inteltec/src/App.tsx`.
- **Highest-risk code areas:** `artifacts/api-server/src/middlewares/auth.ts`, `artifacts/api-server/src/routes/auth.ts`, `artifacts/api-server/src/routes/producao.ts`, `artifacts/api-server/src/routes/clientes.ts`, `artifacts/api-server/src/routes/precos.ts`.
- **Public surface:** `/api/auth/login`, `/api/healthz`.
- **Authenticated cliente surface:** `/api/auth/me`, `/api/producao*` client views, and any endpoint reachable with `requireAuth` but without staff-only role checks.
- **Privileged staff/admin surface:** `/api/users*`, mutating `/api/clientes*`, `/api/produtos*`, workflow stage endpoints, `/api/dashboard*`, `/api/precos*`.
- **Usually dev-only:** `artifacts/mockup-sandbox/**`, generated scan hits that only land there.

## Threat Categories

### Spoofing

This project relies on locally issued JWT bearer tokens for every authenticated API request. The API must reject requests unless the token is signed with a deployment-specific secret, and it must never silently accept a hardcoded fallback signing key. Password-based login must also resist credential-stuffing and brute-force abuse at the public `/api/auth/login` boundary.

### Tampering

Production workflow transitions, order contents, prices, and customer records are business-critical. The API must enforce role checks on every mutating route and must derive authorization from the authenticated user rather than trusting client-supplied identifiers such as `clienteId`.

### Information Disclosure

The database stores customer PII/business data, customer-specific pricing, and cross-customer production history. API responses must be scoped so `cliente` users can only view their own records, while staff-only datasets such as full client registries and price tables must never be exposed to ordinary authenticated users.

### Denial of Service

The public login endpoint is the main internet-facing abuse surface. It must have request throttling or equivalent controls so attackers cannot brute-force credentials or generate excessive bcrypt work at low cost.

### Elevation of Privilege

The primary privilege-separation problem in this app is the boundary between `cliente` accounts and internal `admin`/`apontador` staff. Every route that reads or mutates orders, items, customers, prices, and administrative datasets must enforce ownership and role authorization server-side, including edge cases where a client account has unexpected or null associations.
