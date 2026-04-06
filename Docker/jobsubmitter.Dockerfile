
FROM node:20-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY .env .env

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @climpt/jobsubmitter build


FROM node:20-slim AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

COPY --from=builder /app/apps/jobsubmitter ./apps/jobsubmitter
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

EXPOSE 8000

CMD ["pnpm", "--filter", "@climpt/jobsubmitter", "start"]