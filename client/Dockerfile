# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root monorepo files
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install only client dependencies
RUN npm ci --workspace=client

# Copy client source code
COPY client/ ./client/

WORKDIR /app/client
RUN npm run build

# Stage 2: Production with nginx
FROM nginx:alpine AS production

# Copy built files from builder to nginx html directory
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
