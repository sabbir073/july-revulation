// seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hash passwords
    const password = await bcrypt.hash('DemoPassword123!', 10);

    // Create Admin User and retrieve the ID for later use
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: password,
            role: 'ADMIN',
            display_name: 'Admin',
        },
    });

    // Create Vendor and Regular User without needing their IDs
    await prisma.user.createMany({
        data: [
            {
                name: 'Vendor User',
                email: 'vendor@example.com',
                password: password,
                role: 'VENDOR',
                display_name: 'Vendor',
            },
            {
                name: 'Regular User',
                email: 'user@example.com',
                password: password,
                role: 'USER',
                display_name: 'User',
            },
        ],
    });
    console.log('Users created successfully');

    // Seed Occupations
    await prisma.occupation.createMany({
        data: [
            { title: 'Student', created_by_id: admin.id },
            { title: 'Doctor', created_by_id: admin.id },
            { title: 'Private Job', created_by_id: admin.id },
            { title: 'Engineer', created_by_id: admin.id },
        ],
    });
    console.log('Occupations seeded');

    // Seed Institutions
    await prisma.institution.createMany({
        data: [
            { title: 'Uttara High School', created_by_id: admin.id },
            { title: 'Rajuk Uttara Model College', created_by_id: admin.id },
            { title: 'Uttara University', created_by_id: admin.id },
            { title: 'Milestone College', created_by_id: admin.id },
        ],
    });
    console.log('Institutions seeded');

    // Seed Incident Locations
    await prisma.incidentLocation.createMany({
        data: [
            { title: 'Jasimuddin Mor', created_by_id: admin.id },
            { title: 'Rajlokkhi', created_by_id: admin.id },
            { title: 'Azampur', created_by_id: admin.id },
            { title: 'Housebuilding', created_by_id: admin.id },
            { title: 'BNS Center', created_by_id: admin.id },
        ],
    });
    console.log('Incident Locations seeded');

    console.log('Database seeding completed successfully');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
