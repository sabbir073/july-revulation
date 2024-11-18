// api/people/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const personId = parseInt(params.id);

  try {
    await prisma.people.delete({
      where: { id: personId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ success: false, error: "Error deleting entry" }, { status: 500 });
  }
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const personId = parseInt(params.id);
  
    try {
      const person = await prisma.people.findUnique({
        where: { id: personId },
        include: {
          occupation: { select: { title: true } },
          institution: { select: { title: true } },
          incident_location: { select: { title: true } },
          submitted_by: { select: { name: true } },
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