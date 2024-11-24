// api/people/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const personId = parseInt(params.id);

  try {
    const person = await prisma.people.findUnique({
      where: { id: personId },
      select: {
        name: true,
        age: true,
        occupation: { select: { title: true } },
        institution: { select: { title: true } },
        date: true,
        date_of_death: true,
        story: true,
        profile_picture: true,
        gallery: true,
        incident_location: { select: { title: true } },
        incident_type: true,
        gender: true,
        documentary: true,
      },
    });

    if (!person) {
      return NextResponse.json({ success: false, error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, person });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, error: "Error fetching data" }, { status: 500 });
  }
}
