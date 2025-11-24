const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkStats() {
  try {
    const totalCrew = await prisma.crew.count()
    const crewWithCodes = await prisma.crew.count({ where: { crewCode: { not: null } } })
    const totalCerts = await prisma.certificate.count()
    const certsWithExpiry = await prisma.certificate.count({ where: { expiryDate: { not: null } } })
    const certsUnlimited = await prisma.certificate.count({ where: { expiryDate: null } })
    
    // Group certificates by type
    const certsByType = await prisma.certificate.groupBy({
      by: ['type'],
      _count: true,
      orderBy: { _count: { type: 'desc' } }
    })
    
    console.log('📊 DATABASE STATISTICS')
    console.log('='.repeat(60))
    console.log(`👥 Total Crew: ${totalCrew}`)
    console.log(`   ├─ With crew codes: ${crewWithCodes}`)
    console.log(`   └─ Without crew codes: ${totalCrew - crewWithCodes}`)
    console.log()
    console.log(`📜 Total Certificates: ${totalCerts}`)
    console.log(`   ├─ With expiry date: ${certsWithExpiry}`)
    console.log(`   └─ Unlimited: ${certsUnlimited}`)
    console.log()
    console.log('📋 Certificates by Type:')
    certsByType.forEach(cert => {
      console.log(`   ${cert.type.padEnd(20)} : ${cert._count} certificates`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStats()
