import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Running migrations...')
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  console.log('Migrations done')

  const levelCount = await prisma.level.count()
  if (levelCount === 0) {
    console.log('Seeding database...')
    execSync('npx prisma db seed', { stdio: 'inherit' })
    console.log('Seeding done')
  } else {
    console.log(`Database already has ${levelCount} levels, skipping seed`)
  }
}

main()
  .catch((e) => {
    console.error('Migration/seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
