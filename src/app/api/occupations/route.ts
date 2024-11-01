import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET() {
  try {
    const occupations = await prisma.occupation.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return NextResponse.json(occupations, { status: 200 });
  } catch (error) {
    console.error("Error fetching occupations:", error);
    return NextResponse.json({ error: "An error occurred while fetching occupations." }, { status: 500 });
  }
}
