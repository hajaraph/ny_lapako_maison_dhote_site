# syntax=docker/dockerfile:1.7

FROM oven/bun:1.3.13-alpine AS backend
WORKDIR /app/backend

COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile --production

COPY backend/ ./

EXPOSE 3000
CMD ["bun", "run", "start"]

FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:1.27-alpine AS frontend-nginx
WORKDIR /usr/share/nginx/html

COPY --from=frontend-build /app/frontend/dist ./
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
