const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkCrew() {
  const crew20 = await prisma.crew.findUnique({ where: { id: 20 } })
  
  if (crew20) {
    console.log('✅ Crew #20 found:', crew20.fullName)
  } else {
    console.log('❌ Crew #20 NOT FOUND')
    
    // Show available IDs
    const allCrew = await prisma.crew.findMany({ 
      select: { id: true, fullName: true },
      orderBy: { id: 'asc' },
      take: 30
    })
    
    console.log('\n📋 Available Crew (first 30):')
    allCrew.forEach(c => console.log(`  ID ${c.id}: ${c.fullName}`))
  }
  
  await prisma.$disconnect()
}

checkCrew()
