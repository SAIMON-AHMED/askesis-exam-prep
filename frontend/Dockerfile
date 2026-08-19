# ===== Dependencies Stage =====
FROM node:20-slim AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --only=production && npm cache clean --force


# ===== Build Stage =====
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

# Build Next.js application
RUN npm run build


# ===== Production Runtime Stage =====
FROM node:20-slim

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy public assets
COPY --from=builder /app/public ./public

# Copy built application
COPY --from=builder /app/.next ./.next

# Copy package.json
COPY package.json ./

# Create non-root user
RUN useradd -m -u 1000 nextuser && chown -R nextuser:nextuser /app
USER nextuser

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["npm", "start"]
