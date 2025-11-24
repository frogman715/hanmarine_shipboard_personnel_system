const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDataPopulation() {
  const total = await prisma.crew.count()
  const withDOB = await prisma.crew.count({ where: { dateOfBirth: { not: null } } })
  const withPhone = await prisma.crew.count({ where: { phoneMobile: { not: null } } })
  const withAddress = await prisma.crew.count({ where: { address: { not: null } } })
  const withHeight = await prisma.crew.count({ where: { heightCm: { not: null } } })
  const withWeight = await prisma.crew.count({ where: { weightKg: { not: null } } })
  
  console.log('📊 CREW DATA POPULATION')
  console.log('='.repeat(60))
  console.log(`👥 Total Crew: ${total}`)
  console.log(`🎂 With Date of Birth: ${withDOB} (${Math.round(withDOB/total*100)}%)`)
  console.log(`📱 With Phone: ${withPhone} (${Math.round(withPhone/total*100)}%)`)
  console.log(`📍 With Address: ${withAddress} (${Math.round(withAddress/total*100)}%)`)
  console.log(`📏 With Height: ${withHeight} (${Math.round(withHeight/total*100)}%)`)
  console.log(`⚖️  With Weight: ${withWeight} (${Math.round(withWeight/total*100)}%)`)
  
  await prisma.$disconnect()
}

checkDataPopulation()
