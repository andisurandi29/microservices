import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () { return this.toString() };

async function main() {
  console.log('Memulai Seeding Users & Roles...');

  // Password seragam: "12345678"
  const hashedPassword = await bcrypt.hash('12345678', 10);

  // --- DATA SEEDING ---
  const usersToSeed = [
    {
      name: 'Super Admin',
      email: 'admin@test.com',
      role: 'ADMIN',
      status: true
    },
    {
      name: 'Pembeli Sultan',
      email: 'pembeli@test.com',
      role: 'PEMBELI',
      status: true
    }
  ];

  for (const userData of usersToSeed) {
    // 1. Cari atau Buat User
    const user = await prisma.users.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        status: userData.status,
      },
    });

    console.log(`User diproses: ${user.email} (ID: ${user.id})`);

    // 2. Cek & Buat Role 
    const existingRole = await prisma.users_role.findFirst({
      where: {
        user_id: user.id,
        role: userData.role
      }
    });

    if (!existingRole) {
      await prisma.users_role.create({
        data: {
          user_id: user.id,
          role: userData.role
        }
      });
      console.log(`Role ditambahkan: ${userData.role}`);
    } else {
      console.log(`Role sudah ada: ${userData.role}`);
    }
  }

  console.log('Seeding Selesai!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Terjadi Error Seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });