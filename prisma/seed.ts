import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Check if InstallmentConfig exists
    const configExists = await prisma.installmentConfig.findFirst()

    if (!configExists) {
      console.log('📝 Creating InstallmentConfig...')
      await prisma.installmentConfig.create({
        data: {
          adminFee: 100000, // IDR 100k
          yearlyMargin: 10, // 10% per year
          lateFeePerDay: 10000, // IDR 10k per day
          minDpPercent: 20,
          maxDpPercent: 50,
          minTenorMonths: 12,
          maxTenorMonths: 36,
          isActive: true,
        },
      })
      console.log('✅ InstallmentConfig created')
    } else {
      console.log('⏭️  InstallmentConfig already exists, skipping...')
    }

    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (!adminExists) {
      console.log('👤 Creating admin user...')
      const hashedPassword = await bcrypt.hash('admin123', 10)

      await prisma.user.create({
        data: {
          email: 'admin@brankaslm.com',
          name: 'Admin BRANKAS',
          role: 'ADMIN',
          password: hashedPassword,
          emailVerified: true,
          accountType: 'INDIVIDUAL',
          balance: 0,
        },
      })
      console.log('✅ Admin user created')
      console.log('📧 Email: admin@brankaslm.com')
      console.log('🔑 Password: admin123')
    } else {
      console.log('⏭️  Admin user already exists, skipping...')
    }

    // Check if products exist
    const productsExist = await prisma.physicalProduct.findFirst()

    if (!productsExist) {
      console.log('🏪 Creating sample products...')

      const products = [
        {
          name: 'Logam Mulia ANTAM 1 gram',
          brand: 'ANTAM',
          weight: 1,
          type: 'BAR',
          price: 1250000,
          stock: 100,
          description: 'Emas batangan ANTAM 1 gram dengan sertifikat resmi',
        },
        {
          name: 'Logam Mulia ANTAM 5 gram',
          brand: 'ANTAM',
          weight: 5,
          type: 'BAR',
          price: 6200000,
          stock: 50,
          description: 'Emas batangan ANTAM 5 gram dengan sertifikat resmi',
        },
        {
          name: 'Logam Mulia ANTAM 10 gram',
          brand: 'ANTAM',
          weight: 10,
          type: 'BAR',
          price: 12400000,
          stock: 30,
          description: 'Emas batangan ANTAM 10 gram dengan sertifikat resmi',
        },
        {
          name: 'UBS Gold Bar 1 gram',
          brand: 'UBS',
          weight: 1,
          type: 'BAR',
          price: 1280000,
          stock: 80,
          description: 'Emas batangan UBS 1 gram Swiss quality',
        },
        {
          name: 'PAMP Suisse 5 gram',
          brand: 'PAMP_SUISSE',
          weight: 5,
          type: 'BAR',
          price: 6350000,
          stock: 40,
          description: 'Emas batangan PAMP Suisse 5 gram dengan desain eksklusif',
        },
        {
          name: 'Lotus Archi 10 gram',
          brand: 'LOTUS_ARCHI',
          weight: 10,
          type: 'BAR',
          price: 12600000,
          stock: 25,
          description: 'Emas batangan Lotus Archi 10 gram premium quality',
        },
      ]

      for (const product of products) {
        await prisma.physicalProduct.create({
          data: {
            ...product,
            isActive: true,
          },
        })
      }

      console.log(`✅ Created ${products.length} sample products`)
    } else {
      console.log('⏭️  Products already exist, skipping...')
    }

    // Create initial gold price if not exists
    const goldPriceExists = await prisma.goldPrice.findFirst()

    if (!goldPriceExists) {
      console.log('💰 Creating initial gold price...')
      await prisma.goldPrice.create({
        data: {
          buyPrice: 1250000, // IDR per gram
          sellPrice: 1200000, // IDR per gram (buyback)
          date: new Date(),
        },
      })
      console.log('✅ Initial gold price created')
    } else {
      console.log('⏭️  Gold price already exists, skipping...')
    }

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`   - InstallmentConfig: ${configExists ? 'Exists' : 'Created'}`)
    console.log(`   - Admin User: ${adminExists ? 'Exists' : 'Created'}`)
    console.log(`   - Products: ${productsExist ? 'Exists' : 'Created'}`)
    console.log(`   - Gold Price: ${goldPriceExists ? 'Exists' : 'Created'}`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
