FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json


RUN npm ci -w server --install-strategy=nested

COPY server/ ./server/

WORKDIR /app/server
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app/server

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/server/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "run", "start:prod"]