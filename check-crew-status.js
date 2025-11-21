const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkCrewStatus() {
  try {
    console.log('🔍 Checking crew status and office reporting...\n')
    
    // Count by crewStatus
    const total = await prisma.crew.count()
    const onboard = await prisma.crew.count({ where: { crewStatus: 'ONBOARD' } })
    const standby = await prisma.crew.count({ where: { crewStatus: 'STANDBY' } })
    const inactive = await prisma.crew.count({ where: { crewStatus: 'INACTIVE' } })
    
    console.log('📊 CREW STATUS SUMMARY')
    console.log('='.repeat(60))
    console.log(`👥 Total Crew: ${total}`)
    console.log(`🚢 ONBOARD: ${onboard} (active on vessels)`)
    console.log(`⏸️  STANDBY: ${standby} (off from vessels, available)`)
    console.log(`❌ INACTIVE (Ex-Crew): ${inactive}`)
    
    // Check STANDBY crew reporting status
    console.log('\n📋 STANDBY CREW - Office Reporting Status:')
    console.log('='.repeat(60))
    
    const standbyCrew = await prisma.crew.findMany({
      where: {
        crewStatus: 'STANDBY'
      },
      include: {
        assignments: {
          where: {
            status: 'COMPLETED'
          },
          orderBy: {
            signOff: 'desc'
          },
          take: 1
        }
      }
    })
    
    const reported = standbyCrew.filter(c => c.reportedToOffice === true)
    const unreported = standbyCrew.filter(c => c.reportedToOffice === false)
    const needsReview = standbyCrew.filter(c => c.reportedToOffice === null)
    
    console.log(`✅ Reported to office: ${reported.length}`)
    console.log(`❌ NOT reported (needs follow up): ${unreported.length}`)
    console.log(`⚠️  Needs admin review: ${needsReview.length}`)
    
    if (unreported.length > 0) {
      console.log('\n⚠️  CREW WHO DID NOT REPORT TO OFFICE:')
      console.log('-'.repeat(60))
      unreported.slice(0, 10).forEach(c => {
        const lastAssignment = c.assignments[0]
        console.log(`❌ ${c.fullName} (${c.rank || 'N/A'})`)
        if (lastAssignment) {
          console.log(`   Last vessel: ${lastAssignment.vesselName}`)
          console.log(`   Sign off: ${lastAssignment.signOff?.toISOString().split('T')[0] || 'N/A'}`)
        }
        console.log()
      })
      if (unreported.length > 10) {
        console.log(`... and ${unreported.length - 10} more`)
      }
    }
    
    if (reported.length > 0) {
      console.log('\n✅ CREW WHO REPORTED TO OFFICE (Sample):')
      console.log('-'.repeat(60))
      reported.slice(0, 5).forEach(c => {
        console.log(`✅ ${c.fullName} (${c.rank || 'N/A'})`)
        console.log(`   Report date: ${c.reportedToOfficeDate?.toISOString().split('T')[0] || 'N/A'}`)
        console.log()
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCrewStatus()
