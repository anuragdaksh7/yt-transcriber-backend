# Stage 1: Install and Build
FROM oven/bun:1.1.13 AS builder

WORKDIR /app

COPY bun.lockb package.json tsconfig.json ./
RUN bun install --frozen-lockfile

COPY . .

# Optional: Generate Prisma client if using Prisma
# RUN npx prisma generate

# Stage 2: Runtime
FROM oven/bun:1.1.13 AS runner

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["bun", "start"]
