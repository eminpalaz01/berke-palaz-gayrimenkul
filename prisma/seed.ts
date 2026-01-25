// Database seed script
// This script populates the database with initial data including admin user and sample listings/blog posts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const SALT_ROUNDS = 12

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  console.log('Creating admin user...')
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || '123'

  // Hash the password before storing
  console.log('Hashing admin password...')
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hashedPassword = await bcrypt.hash(adminPassword, salt)

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {
      // Update password if user exists (useful for re-seeding)
      password: hashedPassword,
    },
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  })
  console.log('✅ Admin user created with hashed password')
  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
