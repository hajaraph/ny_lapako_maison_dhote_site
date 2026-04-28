# ── Backend ──────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS backend

WORKDIR /app

COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile --production

COPY backend/ .

RUN mkdir -p uploads/evenements uploads/actualites

EXPOSE 3000

CMD ["bun", "index.ts"]

# ── Frontend : build Vite ────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-build

WORKDIR /app

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ── Frontend : Nginx ─────────────────────────────────────────────────────────
FROM nginx:alpine AS frontend-nginx

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
