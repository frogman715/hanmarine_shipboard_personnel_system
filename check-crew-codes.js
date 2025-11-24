const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkCrewCodes() {
  const crew = await prisma.crew.findMany({
    select: {
      id: true,
      crewCode: true,
      fullName: true,
      rank: true,
    },
    orderBy: { id: 'asc' },
  })

  console.log('📊 Crew Code Status:\n')
  
  const withCode = crew.filter(c => c.crewCode)
  const withoutCode = crew.filter(c => !c.crewCode)

  console.log(`✅ With Code: ${withCode.length}`)
  console.log(`❌ Without Code: ${withoutCode.length}`)
  console.log(`📋 Total: ${crew.length}\n`)

  if (withCode.length > 0) {
    console.log('Sample crew with codes:')
    withCode.slice(0, 10).forEach(c => {
      console.log(`  ${c.crewCode} - ${c.fullName} (${c.rank})`)
    })
  }

  if (withoutCode.length > 0) {
    console.log('\n⚠️  Crew without codes:')
    withoutCode.slice(0, 10).forEach(c => {
      console.log(`  ID ${c.id} - ${c.fullName} (${c.rank})`)
    })
  }
}

checkCrewCodes()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
