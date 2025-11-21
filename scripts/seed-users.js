const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🔐 Creating default users for all roles...\n');

  const defaultPassword = await bcrypt.hash('hanmarine123', 10);

  const users = [
    {
      username: 'owner',
      email: 'owner@hanmarine.com',
      password: defaultPassword,
      fullName: 'Owner',
      role: 'OWNER',
    },
    {
      username: 'director',
      email: 'director@hanmarine.com',
      password: defaultPassword,
      fullName: 'Director',
      role: 'DIRECTOR',
    },
    {
      username: 'admin',
      email: 'admin@hanmarine.com',
      password: defaultPassword,
      fullName: 'Admin',
      role: 'ADMIN',
    },
    {
      username: 'crewing',
      email: 'crewing@hanmarine.com',
      password: defaultPassword,
      fullName: 'Crewing Manager',
      role: 'CREWING_MANAGER',
    },
    {
      username: 'expert',
      email: 'expert@hanmarine.com',
      password: defaultPassword,
      fullName: 'Expert Staff',
      role: 'EXPERT_STAFF',
    },
    {
      username: 'documentation',
      email: 'documentation@hanmarine.com',
      password: defaultPassword,
      fullName: 'Documentation Officer',
      role: 'DOCUMENTATION_OFFICER',
    },
    {
      username: 'accounting',
      email: 'accounting@hanmarine.com',
      password: defaultPassword,
      fullName: 'Accounting Officer',
      role: 'ACCOUNTING_OFFICER',
    },
    {
      username: 'training',
      email: 'training@hanmarine.com',
      password: defaultPassword,
      fullName: 'Training Officer',
      role: 'TRAINING_OFFICER',
    },
    {
      username: 'operational',
      email: 'operational@hanmarine.com',
      password: defaultPassword,
      fullName: 'Operational Staff',
      role: 'OPERATIONAL_STAFF',
    },
  ];

  for (const userData of users) {
    try {
      const existing = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      if (existing) {
        console.log(`⏭️  User ${userData.username} already exists, skipping...`);
        continue;
      }

      const user = await prisma.user.create({
        data: userData,
      });

      console.log(`✅ Created user: ${user.fullName} (${user.role})`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: hanmarine123\n`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.username}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ User seeding completed!');
  console.log('='.repeat(60));
  console.log('\nDefault credentials:');
  console.log('All users have password: hanmarine123');
  console.log('\nUsernames:');
  users.forEach(u => {
    console.log(`  - ${u.username} (${u.role})`);
  });
  console.log('='.repeat(60));
}

seedUsers()
  .then(() => {
    console.log('\n✅ Seed completed!');
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
