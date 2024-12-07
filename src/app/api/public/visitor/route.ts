import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Fetch visitor details from the database
    const visitors = await prisma.visitor.findMany({
      select: {
        id: true,
        ip_address: true,
        country: true,
        region: true,
        city: true,
        visit_count: true,
        visited_at: true,
      },
      orderBy: { visited_at: "desc" }, // Order by the most recent visit
    });

    // Fetch the total sum of all visit counts
    const totalVisitCount = await prisma.visitor.aggregate({
      _sum: {
        visit_count: true,
      },
    });

    return NextResponse.json({
      success: true,
      visitors,
      total_visit_count: totalVisitCount._sum.visit_count || 0, // Include total count
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching visitors.",
      },
      { status: 500 }
    );
  }
}
