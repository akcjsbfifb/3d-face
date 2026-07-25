# Portfolio · Martín Moloeznik

Monorepo pnpm + Docker (+ Nix flake for the toolchain):

```
apps/web   Next.js 16 (portfolio front)
apps/api   Hono API (health + contact)
docker/    Dockerfiles (hollow image + prod)
flake.nix  Node 22 + corepack (pnpm via packageManager field)
```

## Nix vs pnpm (roles)

| Tool | Role |
|------|------|
| **Nix** | Pins *system* tools: Node, corepack, and (later) anything else CI needs. Same versions on laptop, VPS runner, and Docker builder. |
| **pnpm** | Pins *JS packages* in `pnpm-lock.yaml` / `node_modules`. Still required. |

Nix does **not** replace pnpm here. Nix gives you the right `node`/`pnpm`; pnpm still installs React, Next, Hono, etc.

## Local with Nix (recommended)

```bash
# one-time: direnv allow   (optional, if you use .envrc)
nix develop          # enters shell with Node 22 + pnpm (corepack shim)
pnpm install
pnpm dev
```

CI-equivalent locally:

```bash
nix run .#ci         # pnpm install --frozen-lockfile && lint && build
```

Inside `nix develop`, do **not** run `corepack enable` — the Nix store is read-only; the flake already exposes `pnpm` via a corepack shim.

## Local (sin Nix, sin Docker)

```bash
corepack enable
pnpm install
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/health

## Docker (dev, hollow image + bind mounts)

```bash
corepack enable
pnpm install          # genera pnpm-lock.yaml la primera vez
docker compose up --build
# o con rebuild auto de deps:
docker compose up --watch --build
```

## Docker (prod)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Notas

- El error de Turbopack / `global-error` venía de dos `package-lock.json` (root + site). Ahora hay un solo `pnpm-lock.yaml` en la raíz y `turbopack.root` apunta a `apps/web`.
- Email de contacto: placeholder en `apps/web/components/footer.tsx`.
- Logo IPS: monograma tipográfico hasta tener el asset real.
- API `POST /contact` loguea el payload; cablear email/CRM después.
