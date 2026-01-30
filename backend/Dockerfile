# Backend - Node.js API
# Multi-stage build for smaller production image
# ==============================================

# ---------------------------------------------
# Stage 1: Production dependencies
# ---------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy only package files first (better layer cache)
COPY package.json package-lock.json* ./

# Install production dependencies only, no scripts (faster, smaller)
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ---------------------------------------------
# Stage 2: Dev dependencies (for dev profile only)
# ---------------------------------------------
FROM node:20-alpine AS dev-dependencies

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --ignore-scripts && npm cache clean --force

# ---------------------------------------------
# Stage 3: Production
# ---------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy production node_modules from dependencies stage
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

CMD ["node", "server.js"]
