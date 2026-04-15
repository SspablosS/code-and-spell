# Code & Spell

## Setup

- Требования: Node.js 18+, npm
- Скопируй переменные окружения:

```bash
cp .env.example .env
```

## Development

Установка зависимостей (в корне монорепо):

```bash
npm install
```

Запуск frontend + backend в режиме разработки:

```bash
npm run dev
```

## Docker

Запуск всего стека через Docker Compose:

```bash
cd docker
docker compose up --build
```

## Testing

Запуск тестов во всех workspace-пакетах:

```bash
npm test
```
