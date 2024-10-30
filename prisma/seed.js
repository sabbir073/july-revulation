// seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hash passwords
    const password = await bcrypt.hash('DemoPassword123!', 10);

    // Create users with different roles
    await prisma.user.createMany({
        data: [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: password,
                role: 'ADMIN',
                display_name: 'Admin',
            },
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
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
