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

  // Create sample listings
  console.log('Creating sample listings...')
  const listings = [
    {
      title: 'Modern Daire',
      description: 'Şehir merkezinde modern ve konforlu daire',
      location: 'Beşiktaş, İstanbul',
      price: 5800000,
      currency: '₺',
      type: 'sale',
      status: 'active',
      propertyType: 'apartment',
      area: 120,
      rooms: 3,
      bathrooms: 2,
      floor: 5,
      buildingAge: 2,
      features: JSON.stringify(['Asansör', 'Otopark', 'Güvenlik']),
      images: JSON.stringify([]),
      coverImage: '/images/listings/listing-1.jpg',
      locale: 'tr',
    },
    {
      title: 'Lüks Villa',
      description: 'Deniz manzaralı lüks villa',
      location: 'Çeşme, İzmir',
      price: 45000,
      currency: '₺',
      type: 'rent',
      status: 'active',
      propertyType: 'villa',
      area: 350,
      rooms: 5,
      bathrooms: 4,
      buildingAge: 1,
      features: JSON.stringify(['Havuz', 'Bahçe', 'Deniz Manzarası']),
      images: JSON.stringify([]),
      coverImage: '/images/listings/listing-2.jpg',
      locale: 'tr',
    },
    {
      title: 'Stüdyo Daire',
      description: 'Merkezi konumda stüdyo daire',
      location: 'Kadıköy, İstanbul',
      price: 1850000,
      currency: '₺',
      type: 'sale',
      status: 'inactive',
      propertyType: 'apartment',
      area: 45,
      rooms: 1,
      bathrooms: 1,
      floor: 3,
      buildingAge: 5,
      features: JSON.stringify(['Asansör', 'Güvenlik']),
      images: JSON.stringify([]),
      coverImage: '/images/listings/listing-3.jpg',
      locale: 'tr',
    },
  ]

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing,
    })
  }
  console.log(`✅ Created ${listings.length} sample listings`)

  // Create sample blog posts
  console.log('Creating sample blog posts...')
  const blogPosts = [
    {
      title: 'Gayrimenkul Yatırımında Dikkat Edilmesi Gerekenler',
      slug: 'gayrimenkul-yatiriminda-dikkat-edilmesi-gerekenler',
      excerpt: 'Gayrimenkul yatırımı yaparken dikkat etmeniz gereken önemli noktalar',
      content: 'Gayrimenkul yatırımı, uzun vadeli ve güvenli bir yatırım aracıdır...',
      coverImage: '/images/blog/blog-1.jpg',
      author: 'Berke Palaz',
      status: 'published',
      tags: JSON.stringify(['Yatırım', 'Gayrimenkul', 'Finans']),
      locale: 'tr',
      publishedAt: new Date('2024-05-15'),
    },
    {
      title: 'Konut Kredisi Alırken Nelere Dikkat Etmelisiniz?',
      slug: 'konut-kredisi-alirken-nelere-dikkat-etmelisiniz',
      excerpt: 'Konut kredisi başvurusu yaparken bilmeniz gerekenler',
      content: 'Konut kredisi almak ev sahibi olmanın en yaygın yollarından biridir...',
      coverImage: '/images/blog/blog-2.jpg',
      author: 'Berke Palaz',
      status: 'draft',
      tags: JSON.stringify(['Kredi', 'Konut', 'Finans']),
      locale: 'tr',
    },
    {
      title: 'Ev Satışında Pazarlama Stratejileri',
      slug: 'ev-satisinda-pazarlama-stratejileri',
      excerpt: 'Evinizi hızlı ve karlı satmak için etkili pazarlama yöntemleri',
      content: 'Ev satışında başarılı olmak için doğru pazarlama stratejileri çok önemlidir...',
      coverImage: '/images/blog/blog-3.jpg',
      author: 'Berke Palaz',
      status: 'published',
      tags: JSON.stringify(['Satış', 'Pazarlama', 'Gayrimenkul']),
      locale: 'tr',
      publishedAt: new Date('2024-05-01'),
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post,
    })
  }
  console.log(`✅ Created ${blogPosts.length} sample blog posts`)

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
