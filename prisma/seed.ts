import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('Admin@123456', 12);
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

    // Create regular users with strong passwords
    const userPassword = await hash('User@123456', 12);
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
      {
        email: 'robert.wilson@example.com',
        name: 'Robert Wilson',
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
