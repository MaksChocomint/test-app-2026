# Используем Bun
FROM oven/bun:alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./ 
COPY prisma ./prisma/

RUN bun install --frozen-lockfile

# Сборка приложения
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bunx prisma generate
RUN bun run build

# Production образ
FROM oven/bun:alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000

CMD ["bun", "run", "start"]