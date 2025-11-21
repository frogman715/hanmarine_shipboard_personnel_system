const prisma = require('@prisma/client').PrismaClient;
const client = new prisma();

async function testVessel() {
  try {
    console.log('Checking vessels...');
    
    const count = await client.vessel.count();
    console.log('📊 Total vessels in database:', count);
    
    const vessels = await client.vessel.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    
    console.log('📋 Vessels:', vessels);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.$disconnect();
  }
}

testVessel();
