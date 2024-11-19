import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

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

    const newInstitution = await prisma.institution.create({
      data: { title, created_by_id: parseInt(created_by_id) },
    });

    return NextResponse.json(
      { success: true, institution: newInstitution },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating institution:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while creating the institution." },
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
        { error: "ID is required to delete an institution." },
        { status: 400 }
      );
    }

    await prisma.institution.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true, message: "Institution deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting institution:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the institution." },
      { status: 500 }
    );
  }
}
