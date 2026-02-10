# Frontend - React + Vite
# Build theo APP_ENV: production (Nginx) | development (Vite dev server)
# ==============================================

# ---------------------------------------------
# Stage 1: Dependencies
# ---------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci && npm cache clean --force

# ---------------------------------------------
# Stage 2: Build (Vite) - dùng cho production
# ---------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Build-time: API URL và môi trường (production = build tối ưu)
ARG VITE_API_BASE_URL=http://localhost:3000/api
ARG APP_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------------------------------------------
# Stage 3: Production (APP_ENV=production) - Nginx
# ---------------------------------------------
FROM nginx:alpine AS production

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ---------------------------------------------
# Stage 4: Development (APP_ENV=development) - Vite dev server
# ---------------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
COPY . .

# Runtime API URL (truyền qua env khi chạy container)
ARG VITE_API_BASE_URL=http://localhost:3000/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
