const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkIssues() {
  console.log('\n🔍 CHECKING FOR DATA ISSUES')
  console.log('='.repeat(80))
  
  // Check duplicate vessels (different cases)
  console.log('\n🚢 VESSEL DUPLICATES:')
  const vessels = await prisma.vessel.findMany({
    orderBy: { name: 'asc' }
  })
  
  const vesselNames = new Set()
  const duplicates = []
  
  vessels.forEach(v => {
    const normalized = v.name.toUpperCase().replace(/\s+/g, ' ').trim()
    if (vesselNames.has(normalized)) {
      duplicates.push(v.name)
    }
    vesselNames.add(normalized)
  })
  
  if (duplicates.length > 0) {
    console.log('   Found potential duplicates:')
    duplicates.forEach(d => console.log(`   - ${d}`))
  } else {
    console.log('   ✅ No obvious duplicates')
  }
  
  // Check invalid vessels
  console.log('\n⚠️  INVALID VESSELS:')
  const invalidVessels = await prisma.vessel.findMany({
    where: {
      OR: [
        { name: { contains: 'VESSEL LIST' } },
        { flag: { contains: 'DATE' } },
        { flag: 'UNKNOWN' }
      ]
    }
  })
  
  if (invalidVessels.length > 0) {
    console.log(`   Found ${invalidVessels.length} invalid vessels:`)
    invalidVessels.forEach(v => {
      console.log(`   - ${v.name} (Flag: ${v.flag})`)
    })
  }
  
  // Check crew without assignments
  console.log('\n👥 CREW WITHOUT ASSIGNMENTS:')
  const crewWithoutAssignments = await prisma.crew.findMany({
    where: {
      assignments: {
        none: {}
      }
    },
    select: {
      id: true,
      fullName: true,
      rank: true,
      crewStatus: true
    },
    take: 10
  })
  
  console.log(`   Found ${crewWithoutAssignments.length} crew (showing first 10):`)
  crewWithoutAssignments.forEach(c => {
    console.log(`   - ${c.fullName} (${c.rank || 'N/A'}) - Status: ${c.crewStatus}`)
  })
  
  // Check assignments without vessels
  console.log('\n🔗 ASSIGNMENTS WITHOUT MATCHING VESSELS:')
  const allAssignments = await prisma.assignment.findMany({
    include: {
      vessel: true
    }
  })
  
  const noVessel = allAssignments.filter(a => !a.vessel)
  console.log(`   Found ${noVessel.length} assignments without matching vessel records`)
  
  if (noVessel.length > 0) {
    const uniqueVessels = [...new Set(noVessel.map(a => a.vesselName))]
    console.log(`   Missing vessels: ${uniqueVessels.join(', ')}`)
  }
  
  console.log('\n' + '='.repeat(80))
}

async function main() {
  try {
    await checkIssues()
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
