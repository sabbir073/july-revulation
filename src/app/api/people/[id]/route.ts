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
          updated_by: { select: { name: true } },
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

  export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const personId = parseInt(params.id);
  
    try {
      const data = await req.json();
  
      // Validate required fields (e.g., name, incident_type, status)
      if (!data.name || !data.incident_type || !data.status) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
      }
  
      // Update the entry in the People table
      const updatedPerson = await prisma.people.update({
        where: { id: personId },
        data: {
          name: data.name,
          age: data.age ? Number(data.age) : null,
          occupation_id: data.occupation_id ? Number(data.occupation_id) : null,
          institution_id: data.institution_id ? Number(data.institution_id) : null,
          address: data.address || null,
          permanent_address: data.permanent_address || null,
          nid: data.nid || null,
          fathers_name: data.fathers_name || null,
          mothers_name: data.mothers_name || null,
          date: data.date ? new Date(data.date) : null,
          date_of_death: data.date_of_death ? new Date(data.date_of_death) : null,
          gender: data.gender,
          story: data.story || null,
          family_member_contact: data.family_member_contact || null,
          profile_picture: data.profile_picture || null,
          gallery: data.gallery || [],
          incident_location_id: data.incident_location_id ? Number(data.incident_location_id) : null,
          incident_type: data.incident_type,
          status: data.status,
          documentary: data.documentary || null,
          updated_at: new Date(), // Update the timestamp for when the record is modified
          updated_by_id: data.updated_by_id || null,
        },
      });
  
      return NextResponse.json({ success: true, updatedPerson });
    } catch (error) {
      console.error("Error updating entry:", error);
  
      // Capture specific error details
      if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: false, error: "Unknown error occurred" }, { status: 500 });
    }
  }