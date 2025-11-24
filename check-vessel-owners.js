const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkVesselOwners() {
  try {
    const vessels = await prisma.vessel.findMany({
      select: {
        name: true,
        owner: true
      }
    })
    
    console.log('🚢 VESSELS & OWNERS:\n')
    vessels.forEach(v => {
      console.log(`${v.name} → ${v.owner || 'NO OWNER'}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVesselOwners()
