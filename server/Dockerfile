# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo files
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install only server dependencies
RUN npm ci --workspace=server

# Copy server source code and Prisma schema
COPY server/ ./server/
COPY server/prisma ./server/prisma/

WORKDIR /app/server
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app/server

# Copy package files
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install only production dependencies
RUN npm ci --workspace=server --omit=dev

# Copy built application from builder
COPY --from=builder /app/server/dist ./dist

# Copy Prisma schema for migrations
COPY --from=builder /app/server/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/index.js"]
