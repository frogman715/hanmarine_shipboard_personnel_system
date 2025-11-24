const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanOldAssignments() {
  try {
    console.log('🔍 Checking old assignments from 2023...\n')
    
    // Get all assignments from 2023
    const oldAssignments = await prisma.assignment.findMany({
      where: {
        signOn: {
          lt: new Date('2024-01-01')
        }
      },
      include: {
        crew: {
          select: {
            fullName: true,
            crewStatus: true
          }
        }
      }
    })
    
    console.log(`Found ${oldAssignments.length} assignments from 2023:\n`)
    
    oldAssignments.forEach(a => {
      console.log(`📋 ${a.crew.fullName} - ${a.rank} on ${a.vesselName}`)
      console.log(`   Sign On: ${a.signOn?.toISOString().split('T')[0]}`)
      console.log(`   Sign Off: ${a.signOff?.toISOString().split('T')[0] || 'N/A'}`)
      console.log(`   Status: ${a.status}`)
      console.log(`   Crew Status: ${a.crew.crewStatus}`)
      console.log()
    })
    
    // Mark old assignments as COMPLETED or OFFBOARD
    console.log('🔄 Updating old assignments status...\n')
    
    const updated = await prisma.assignment.updateMany({
      where: {
        AND: [
          {
            signOn: {
              lt: new Date('2024-01-01')
            }
          },
          {
            status: {
              in: ['ONBOARD', 'PLANNED']
            }
          }
        ]
      },
      data: {
        status: 'COMPLETED',
        signOff: new Date('2023-12-31')
      }
    })
    
    console.log(`✅ Updated ${updated.count} old assignments to COMPLETED\n`)
    
    // Show current ONBOARD assignments
    const currentOnboard = await prisma.assignment.findMany({
      where: {
        status: 'ONBOARD'
      },
      include: {
        crew: {
          select: {
            fullName: true,
            crewStatus: true
          }
        }
      },
      orderBy: {
        signOn: 'asc'
      }
    })
    
    console.log(`📊 Current ONBOARD assignments: ${currentOnboard.length}\n`)
    
    currentOnboard.forEach(a => {
      const monthsOnboard = Math.floor(
        (new Date() - new Date(a.signOn)) / (30 * 24 * 60 * 60 * 1000)
      )
      console.log(`✅ ${a.crew.fullName} - ${a.rank} on ${a.vesselName}`)
      console.log(`   Sign On: ${a.signOn?.toISOString().split('T')[0]} (${monthsOnboard} months)`)
      console.log(`   Crew Status: ${a.crew.crewStatus}`)
      console.log()
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanOldAssignments()
