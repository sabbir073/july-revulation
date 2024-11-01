import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET() {
  try {
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return NextResponse.json(institutions, { status: 200 });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json({ error: "An error occurred while fetching institutions." }, { status: 500 });
  }
}
