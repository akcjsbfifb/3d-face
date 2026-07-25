# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM node:22-alpine AS web-builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app ./
COPY apps/web ./apps/web
RUN pnpm --filter @portfolio/web build

FROM node:22-alpine AS api-builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app ./
COPY apps/api ./apps/api
RUN pnpm --filter @portfolio/api build \
 && pnpm --filter @portfolio/api deploy --prod --legacy /out/api

FROM node:22-alpine AS web
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=web-builder /app/apps/web/public ./apps/web/public
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
COPY --from=api-builder /out/api ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
