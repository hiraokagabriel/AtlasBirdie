import { PrismaClient, type Discipline } from '../src/generated/prisma'

const prisma = new PrismaClient()

// BWF standard disciplines — fixed, not configurable per tenant
export const BWF_DISCIPLINES: { code: Discipline; name: string; isDoubles: boolean }[] = [
  { code: 'MS', name: "Men's Singles", isDoubles: false },
  { code: 'WS', name: "Women's Singles", isDoubles: false },
  { code: 'MD', name: "Men's Doubles", isDoubles: true },
  { code: 'WD', name: "Women's Doubles", isDoubles: true },
  { code: 'XD', name: 'Mixed Doubles', isDoubles: true },
]

async function main() {
  console.log('🌱 Seeding Atlas Birdie database...')

  // Upsert demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-federation' },
    update: {},
    create: {
      name: 'Demo Federation',
      slug: 'demo-federation',
      primaryColor: '#01696f',
      email: 'admin@demo-federation.com',
    },
  })

  console.log(`✅ Tenant: ${tenant.name} (${tenant.id})`)

  // Seed default categories for the demo tenant
  const defaultCategories = [
    { name: 'Sub-13', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 0, maxAge: 13 },
    { name: 'Sub-15', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 0, maxAge: 15 },
    { name: 'Sub-17', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 0, maxAge: 17 },
    { name: 'Sub-19', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 0, maxAge: 19 },
    { name: 'Adulto', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 18, maxAge: null },
    { name: 'Masters 35+', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 35, maxAge: null },
    { name: 'Masters 45+', disciplines: ['MS', 'WS', 'MD', 'WD', 'XD'], allowedGender: 'ANY', minAge: 45, maxAge: null },
  ] as const

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: cat.name } },
      update: {},
      create: {
        tenantId: tenant.id,
        name: cat.name,
        disciplines: cat.disciplines as string[],
        allowedGender: cat.allowedGender,
        minAge: cat.minAge ?? null,
        maxAge: cat.maxAge ?? null,
      },
    })
  }

  console.log(`✅ ${defaultCategories.length} default categories seeded`)
  console.log(`ℹ️  Disciplines are enums — MS, WS, MD, WD, XD are available via the Discipline enum`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
