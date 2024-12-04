import { NextRequest, NextResponse } from 'next/server';
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


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, created_by_id } = body;

    // Validate input
    if (!title || !created_by_id) {
      return NextResponse.json(
        { success: false, message: "Both title and created_by_id are required." },
        { status: 400 }
      );
    }

    const newOccupation = await prisma.occupation.create({
      data: { title, created_by_id: parseInt(created_by_id) },
    });

    return NextResponse.json(
      { success: true, occupation: newOccupation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating occupation:", error); // Log the error
    return NextResponse.json(
      { success: false, message: "An error occurred while creating the occupation." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title } = body;

    if (!id || !title) {
      return NextResponse.json(
        { success: false, message: "Both ID and title are required." },
        { status: 400 }
      );
    }

    const updatedOccupation = await prisma.occupation.update({
      where: { id: Number(id) },
      data: { title },
    });

    return NextResponse.json(
      { success: true, occupation: updatedOccupation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating occupation:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the occupation." },
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
        { error: "ID is required to delete an occupation." },
        { status: 400 }
      );
    }

    await prisma.occupation.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Occupation deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting occupation:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the occupation." },
      { status: 500 }
    );
  }
}