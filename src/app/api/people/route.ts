// app/api/people/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Create a new entry in the People table
    const newPerson = await prisma.people.create({
      data: {
        name: data.name,
        age: data.age ? Number(data.age) : null,
        occupation_id: data.occupation_id ? Number(data.occupation_id) : null,
        institution_id: data.institution_id ? Number(data.institution_id) : null,
        address: data.address || null,
        fathers_name: data.fathers_name || null,
        mothers_name: data.mothers_name || null,
        date: data.date ? new Date(data.date) : null,
        how_died: data.how_died || null,
        how_injured: data.how_injured || null,
        story: data.story || null,
        family_member_contact: data.family_member_contact || null,
        profile_picture: data.profile_picture || null,
        gallery: data.gallery || [],
        incident_location_id: data.incident_location_id ? Number(data.incident_location_id) : null,
        incident_type: data.incident_type,
        status: data.status,
        documentary: data.documentary || null,
        submitted_by_id: data.submitted_by_id,
      },
    });

    return NextResponse.json({ success: true, newPerson });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ success: false, error: 'Error saving data' }, { status: 500 });
  }
}
