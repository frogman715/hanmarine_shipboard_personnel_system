const prisma = require('@prisma/client').PrismaClient;
const client = new prisma();

async function testInsert() {
  try {
    console.log('Testing crew insert...');
    
    const crew = await client.crew.create({
      data: {
        fullName: 'TEST CREW ' + Date.now(),
        rank: 'Master',
        vessel: 'Test Vessel',
      },
    });
    
    console.log('✅ Insert successful:', crew);
    
    // Count total crew
    const count = await client.crew.count();
    console.log('📊 Total crew in database:', count);
    
    // Get recent crew
    const recent = await client.crew.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, rank: true },
    });
    console.log('📋 Recent crew:', recent);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Details:', err);
  } finally {
    await client.$disconnect();
  }
}

testInsert();
