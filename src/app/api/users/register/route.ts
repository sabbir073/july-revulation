import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

// POST: Create a new user
export async function POST(req: NextRequest) {
    try {
      const data = await req.json();
  
      // Validate required fields
      if (!data.name || !data.email || !data.password) {
        return NextResponse.json({ success: false, message: 'Name, email, and password are required.' }, { status: 400 });
      }
  
      // Check if the email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'Email already exists.' }, { status: 400 });
      }
  
      // Hash the password
      const saltRounds = 10; // Standard number of salt rounds for bcrypt
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
      // Create a new user with the default role 'USER'
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'USER', // Set the default role to USER
          display_name: data.display_name || null,
          mobile_number: data.mobile_number || null,
        },
      });
  
      return NextResponse.json({ success: true, message: 'User registered successfully.', newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ success: false, message: 'Error creating user.' }, { status: 500 });
    }
  }
  