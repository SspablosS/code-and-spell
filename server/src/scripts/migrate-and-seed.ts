import { execSync } from 'child_process'

async function main() {
  console.log('Running migrations...')
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  console.log('Migrations done')

  // Upsert в seed.ts — безопасно при каждом деплое (подтягивает изменения из levels.json)
  console.log('Seeding database (upsert)...')
  execSync('npx prisma db seed', { stdio: 'inherit' })
  console.log('Seeding done')
}

main().catch((e) => {
  console.error('Migration/seed failed:', e)
  process.exit(1)
})
