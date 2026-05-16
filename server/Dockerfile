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
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY server/prisma ./prisma
COPY server/package.json ./
COPY database/seeds ./database/seeds

RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "run", "start:prod"]
