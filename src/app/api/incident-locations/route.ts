import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

export async function GET() {
  try {
    const incidentLocations = await prisma.incidentLocation.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return NextResponse.json(incidentLocations, { status: 200 });
  } catch (error) {
    console.error("Error fetching incident locations:", error);
    return NextResponse.json({ error: "An error occurred while fetching incident locations." }, { status: 500 });
  }
}
