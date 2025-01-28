import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  try {
    // Clear existing users
    await prisma.user.deleteMany();

    // Create admin user with proper salt rounds
    const adminPassword = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
    await prisma.user.upsert({
      where: { email: 'admin@placeaway.com' },
      update: {},
      create: {
        email: 'admin@placeaway.com',
        name: 'Admin User',
        password: adminPassword,
        emailVerified: new Date(),
        role: UserRole.ADMIN,
      },
    });

    // Create regular users
    const userPassword = await bcrypt.hash('User@123456', SALT_ROUNDS);
    const users = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: userPassword,
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: userPassword,
      },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          ...user,
          emailVerified: new Date(),
          role: UserRole.USER,
        },
      });
    }

    // Create test user with simple password
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User',
        password: hashedPassword,
        emailVerified: new Date(),
        role: UserRole.USER,
      },
    });

    console.log('Created test user:', {
      email: testUser.email,
      password: 'password123', // Plain password for testing
    });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
