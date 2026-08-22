# Pi Node Telegram Controller PRO — SoloHost Info v1.2
# Lightweight dynamic Node.js shell — no extra deps
FROM node:20-alpine

WORKDIR /app

# Only copy what we need (no node_modules — pure Node stdlib)
COPY package.json ./
COPY server.js ./
COPY public ./public

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE 8080

# Simple healthcheck for SoloHost / orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

USER node
CMD ["node", "server.js"]
