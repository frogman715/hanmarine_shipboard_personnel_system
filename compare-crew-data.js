const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function compareData() {
  console.log('\n📊 COMPARING DATABASE vs EXCEL CREW LIST')
  console.log('='.repeat(80))
  
  // Get ONBOARD crew from database
  const onboardCrew = await prisma.crew.findMany({
    where: { crewStatus: 'ONBOARD' },
    include: {
      assignments: {
        where: { status: 'ONBOARD' },
        include: { vessel: true }
      }
    }
  })
  
  console.log(`\n📋 DATABASE (ONBOARD status): ${onboardCrew.length} crew`)
  console.log(`📋 EXCEL (Crew List Oktober 2025): 77 crew`)
  console.log(`📋 DIFFERENCE: ${onboardCrew.length - 77} crew`)
  
  console.log('\n🔍 BREAKDOWN:')
  console.log(`   - Crew ONBOARD in database: ${onboardCrew.length}`)
  console.log(`   - Crew in Excel (actual active): 77`)
  console.log(`   - Extra crew in DB (from other sources): ${onboardCrew.length - 77}`)
  
  // Get crew by source
  const standbyCrew = await prisma.crew.count({ where: { crewStatus: 'STANDBY' } })
  const inactiveCrew = await prisma.crew.count({ where: { crewStatus: 'INACTIVE' } })
  const totalCrew = await prisma.crew.count()
  
  console.log('\n📊 TOTAL DATABASE BREAKDOWN:')
  console.log(`   Total crew: ${totalCrew}`)
  console.log(`   ├── ONBOARD: ${onboardCrew.length} (should be 77 from Excel)`)
  console.log(`   ├── STANDBY: ${standbyCrew} (available crew)`)
  console.log(`   └── INACTIVE: ${inactiveCrew} (ex-crew)`)
  
  console.log('\n💡 RECOMMENDATION:')
  console.log('   The database has more crew because of:')
  console.log('   1. Historical crew from folder imports (179 crew)')
  console.log('   2. Ex-crew (26 crew)')
  console.log('   3. Multiple imports with different data')
  console.log('\n   To match Excel exactly (77 crew):')
  console.log('   - Keep only crew from CREW LIST OKTOBER 2025.xls as ONBOARD')
  console.log('   - Move others to STANDBY or keep historical data')
}

async function main() {
  try {
    await compareData()
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
