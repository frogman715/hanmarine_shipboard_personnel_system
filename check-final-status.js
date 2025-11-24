const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  console.log('\n📊 DATABASE STATUS CHECK')
  console.log('='.repeat(80))
  
  // Check crew count
  const totalCrew = await prisma.crew.count()
  const activeCrew = await prisma.crew.count({ where: { crewStatus: 'ACTIVE' } })
  const standbyCrew = await prisma.crew.count({ where: { crewStatus: 'STANDBY' } })
  const inactiveCrew = await prisma.crew.count({ where: { crewStatus: 'INACTIVE' } })
  const onboardCrew = await prisma.crew.count({ where: { crewStatus: 'ONBOARD' } })
  
  console.log('\n👥 CREW:')
  console.log(`   Total: ${totalCrew}`)
  console.log(`   Onboard (on vessels): ${onboardCrew}`)
  console.log(`   Standby (available): ${standbyCrew}`)
  console.log(`   Active (other): ${activeCrew}`)
  console.log(`   Inactive (ex-crew): ${inactiveCrew}`)
  
  // Check certificates
  const totalCerts = await prisma.certificate.count()
  console.log(`\n📜 CERTIFICATES: ${totalCerts}`)
  
  // Check vessels
  const totalVessels = await prisma.vessel.count()
  const vessels = await prisma.vessel.findMany({
    select: { name: true, flag: true }
  })
  console.log(`\n🚢 VESSELS: ${totalVessels}`)
  vessels.forEach(v => console.log(`   - ${v.name} (${v.flag})`))
  
  // Check assignments by status
  const totalAssignments = await prisma.assignment.count()
  const onboardAssignments = await prisma.assignment.count({ where: { status: 'ONBOARD' } })
  const plannedAssignments = await prisma.assignment.count({ where: { status: 'PLANNED' } })
  const plannedOffboard = await prisma.assignment.count({ where: { status: 'PLANNED_OFFBOARD' } })
  
  console.log(`\n📋 ASSIGNMENTS:`)
  console.log(`   Total: ${totalAssignments}`)
  console.log(`   ONBOARD (current): ${onboardAssignments}`)
  console.log(`   PLANNED (future join): ${plannedAssignments}`)
  console.log(`   PLANNED_OFFBOARD (future leave): ${plannedOffboard}`)
  
  // Get sample assignments
  const sampleOnboard = await prisma.assignment.findMany({
    where: { status: 'ONBOARD' },
    include: {
      crew: { select: { fullName: true } },
      vessel: { select: { name: true } }
    },
    take: 5
  })
  
  console.log(`\n📌 SAMPLE ONBOARD ASSIGNMENTS:`)
  sampleOnboard.forEach(a => {
    console.log(`   - ${a.crew.fullName} (${a.rank}) on ${a.vessel?.name || a.vesselName}`)
  })
  
  // Get sample planned assignments
  const samplePlanned = await prisma.assignment.findMany({
    where: { status: 'PLANNED' },
    include: {
      crew: { select: { fullName: true } },
      vessel: { select: { name: true } }
    },
    orderBy: { signOn: 'asc' },
    take: 5
  })
  
  console.log(`\n📅 SAMPLE PLANNED REPLACEMENTS 2025:`)
  samplePlanned.forEach(a => {
    const date = a.signOn ? new Date(a.signOn).toLocaleDateString() : 'TBD'
    console.log(`   - ${a.crew.fullName} (${a.rank}) → ${a.vessel?.name || a.vesselName} on ${date}`)
  })
  
  // Check crew codes
  const crewWithCodes = await prisma.crew.count({
    where: {
      crewCode: { not: null }
    }
  })
  console.log(`\n🔢 CREW CODES: ${crewWithCodes} crew have codes`)
  
  // Check DOB
  const crewWithDOB = await prisma.crew.count({
    where: {
      dateOfBirth: { not: null }
    }
  })
  console.log(`📅 DATE OF BIRTH: ${crewWithDOB} crew have DOB`)
  
  console.log('\n' + '='.repeat(80))
  console.log('✅ DATABASE CHECK COMPLETE')
  console.log('='.repeat(80))
}

async function main() {
  try {
    await checkData()
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
