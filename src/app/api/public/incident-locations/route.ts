import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, created_by_id } = body;

    if (!title || !created_by_id) {
      return NextResponse.json(
        { success: false, message: "Both title and created_by_id are required." },
        { status: 400 }
      );
    }

    const newIncidentLocation = await prisma.incidentLocation.create({
      data: { title, created_by_id: parseInt(created_by_id) },
    });

    return NextResponse.json(
      { success: true, incidentLocation: newIncidentLocation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating incident location:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while creating the incident location." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required to delete an incident location." },
        { status: 400 }
      );
    }

    await prisma.incidentLocation.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true, message: "Incident Location deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting incident location:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the incident location." },
      { status: 500 }
    );
  }
}
