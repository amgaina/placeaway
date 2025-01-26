import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('Admin@123', 10);
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
    const userPassword = await hash('User@123', 10);
    const users = [
      {
        email: 'john@example.com',
        name: 'John Doe',
        password: userPassword,
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: userPassword,
      },
      {
        email: 'bob@example.com',
        name: 'Bob Wilson',
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

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
