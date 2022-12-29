FROM public.ecr.aws/docker/library/node:18.12.1-alpine3.16 AS base
MAINTAINER commerce_web2@kurlycorp.com
RUN apk add --no-cache libc6-compat

RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_STAGE
ENV NEXT_TELEMETRY_DISABLED 1
# ENV NODE_OPTIONS "--max-old-space-size=4096"

RUN NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/server ./.next/server
COPY --chown=nextjs:nodejs ./entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

USER nextjs

RUN sed -i 's/server\/next.js/server\/next-server.js/' node_modules/next/package.json

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["./entrypoint.sh"]

