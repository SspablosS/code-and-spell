FROM node:20-alpine AS builder
WORKDIR /app/server

COPY package-lock.json ./
COPY server/package.json ./package.json

RUN npm ci

COPY server/ ./

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app/server

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules
COPY server/prisma ./prisma
COPY server/package.json ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
