const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateVesselOwners() {
  try {
    // Update all variants of ALFA ALANDIA, LANCING, ALFA BALTICA
    const vesselNames = [
      'ALFA ALANDIA',
      'ALFA BALTICA', 
      'LANCING',
      'MT ALFA BALTICA',
      'MT.ALFA BALTICA',
      'MT. ALFA ALANDIA',
      'MT LANCING'
    ]
    
    const updated = await prisma.vessel.updateMany({
      where: {
        name: { in: vesselNames }
      },
      data: {
        owner: 'LUNDQVIST REDERIERNA'
      }
    })
    
    console.log(`✅ Updated ${updated.count} vessels to LUNDQVIST REDERIERNA\n`)
    
    // Check all vessels
    const vessels = await prisma.vessel.findMany({
      where: {
        OR: [
          { name: { contains: 'ALFA' } },
          { name: { contains: 'LANCING' } }
        ]
      },
      select: {
        name: true,
        owner: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log('📋 All ALFA/LANCING vessels:\n')
    vessels.forEach(v => {
      console.log(`${v.name.padEnd(25)} → ${v.owner || 'NO OWNER'}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateVesselOwners()
