FROM node:20-alpine AS builder
WORKDIR /app/client

# Копируем package-lock.json из корня монорепо
# (контекст сборки — корень проекта)
COPY package-lock.json ./
COPY client/package.json ./package.json

# Теперь npm ci работает с корневым lock файлом
RUN npm ci --ignore-scripts

COPY client/ ./

RUN npm run build

FROM nginx:alpine

ENV BACKEND_HOST=code-and-spell.railway.internal
ENV BACKEND_PORT=3001

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/docker-entrypoint.d/99-generate-nginx-conf.sh /docker-entrypoint.d/99-generate-nginx-conf.sh
RUN chmod +x /docker-entrypoint.d/99-generate-nginx-conf.sh

EXPOSE 80
