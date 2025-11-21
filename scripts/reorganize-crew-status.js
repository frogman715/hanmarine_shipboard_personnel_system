const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function reorganizeCrewStatus() {
  console.log('\n🔄 REORGANIZING CREW STATUS')
  console.log('='.repeat(80))
  
  // Get all crew with their assignments
  const allCrew = await prisma.crew.findMany({
    include: {
      assignments: {
        where: {
          OR: [
            { status: 'ONBOARD' },
            { 
              AND: [
                { signOff: null },
                { status: { not: 'PLANNED' } }
              ]
            }
          ]
        }
      }
    }
  })
  
  console.log(`\n📊 Total crew: ${allCrew.length}`)
  
  let onboardCount = 0
  let standbyCount = 0
  let inactiveCount = 0
  let unchangedCount = 0
  
  for (const crew of allCrew) {
    const hasActiveAssignment = crew.assignments.length > 0
    let newStatus = null
    
    // If already INACTIVE (ex-crew), keep it
    if (crew.crewStatus === 'INACTIVE') {
      inactiveCount++
      continue
    }
    
    // If has active assignment → ONBOARD
    if (hasActiveAssignment) {
      if (crew.crewStatus !== 'ONBOARD') {
        newStatus = 'ONBOARD'
        onboardCount++
      } else {
        unchangedCount++
      }
    } else {
      // No active assignment → STANDBY
      if (crew.crewStatus !== 'STANDBY') {
        newStatus = 'STANDBY'
        standbyCount++
      } else {
        unchangedCount++
      }
    }
    
    // Update if needed
    if (newStatus) {
      await prisma.crew.update({
        where: { id: crew.id },
        data: { crewStatus: newStatus }
      })
      console.log(`   ✅ ${crew.fullName}: ${crew.crewStatus} → ${newStatus}`)
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('📊 REORGANIZATION SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Updated to ONBOARD: ${onboardCount}`)
  console.log(`✅ Updated to STANDBY: ${standbyCount}`)
  console.log(`ℹ️  Already INACTIVE (ex-crew): ${inactiveCount}`)
  console.log(`ℹ️  Unchanged: ${unchangedCount}`)
  console.log(`\n📋 Total crew: ${allCrew.length}`)
  
  // Final count
  const finalCounts = await prisma.crew.groupBy({
    by: ['crewStatus'],
    _count: true
  })
  
  console.log('\n📊 FINAL STATUS BREAKDOWN:')
  finalCounts.forEach(c => {
    console.log(`   ${c.crewStatus}: ${c._count}`)
  })
}

async function main() {
  try {
    await reorganizeCrewStatus()
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
