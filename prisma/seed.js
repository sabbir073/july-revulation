import { PrismaClient } from '@prisma/client';
//import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  //const password = await bcrypt.hash('jrabd2024@', 10);

  // Create Admin User (example) and retrieve ID
//   const admin = await prisma.user.create({
//     data: {
//       name: 'Admin User',
//       email: 'admin@example.com',
//       password: password,
//       role: 'ADMIN',
//       display_name: 'Admin',
//     },
//   });

  // Create other users
//   await prisma.user.createMany({
//     data: [
//       {
//         name: 'Vendor User',
//         email: 'vendor@example.com',
//         password: password,
//         role: 'VENDOR',
//         display_name: 'Vendor',
//       },
//       {
//         name: 'Regular User',
//         email: 'user@example.com',
//         password: password,
//         role: 'USER',
//         display_name: 'User',
//       },
//       // ... other users ...
//     ],
//   });
//   console.log('Users created successfully');

  // Seed Occupations
//   await prisma.occupation.createMany({
//     data: [
//       { title: 'Student', created_by_id: admin.id },
//       { title: 'Doctor', created_by_id: admin.id },
//       // ...
//     ],
//   });
//   console.log('Occupations seeded');

  // Seed Institutions
//   await prisma.institution.createMany({
//     data: [
//       { title: 'Uttara High School', created_by_id: admin.id },
//       { title: 'Rajuk Uttara Model College', created_by_id: admin.id },
//       // ...
//     ],
//   });
//   console.log('Institutions seeded');

  // Seed Incident Locations
//   await prisma.incidentLocation.createMany({
//     data: [
//       { title: 'Jasimuddin Mor', created_by_id: admin.id },
//       { title: 'Rajlokkhi', created_by_id: admin.id },
//       // ...
//     ],
//   });
//   console.log('Incident Locations seeded');

  // --------------------------------------------
  //     UPDATE INJURED People FROM PENDING TO VERIFIED
  // --------------------------------------------
  await prisma.people.updateMany({
    where: {
      incident_type: 'INJURED',
      status: 'PENDING',
    },
    data: {
      status: 'VERIFIED',
    },
  });
  console.log('All INJURED people with status PENDING have been updated to VERIFIED');

  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
