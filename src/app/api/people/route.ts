import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { IncidentType, Status } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields (name, incident_type, status, and submitted_by_id)
    if (!data.name || !data.incident_type || !data.status || !data.submitted_by_id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

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

    // Capture specific error details
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'Unknown error occurred' }, { status: 500 });
  }
}


// GET function to fetch all people entries with full fields
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("search") || "";

  try {
    const whereCondition: Prisma.PeopleWhereInput = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { age: !isNaN(Number(searchQuery)) ? { equals: Number(searchQuery) } : undefined },
            { occupation: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
            { institution: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
            { address: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { fathers_name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { mothers_name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { how_died: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { how_injured: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { story: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { family_member_contact: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
            { incident_location: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
            { incident_type: (Object.values(IncidentType) as string[]).includes(searchQuery.toUpperCase())
              ? { equals: searchQuery.toUpperCase() as IncidentType }
              : undefined },
            { status: (Object.values(Status) as string[]).includes(searchQuery.toUpperCase())
              ? { equals: searchQuery.toUpperCase() as Status }
              : undefined },
            { submitted_by: { name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } }
          ].filter(Boolean) // Filters out undefined conditions
        }
      : {}; // Empty filter for initial load

    const people = await prisma.people.findMany({
      where: whereCondition,
      include: {
        occupation: { select: { title: true } },
        institution: { select: { title: true } },
        incident_location: { select: { title: true } },
        submitted_by: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, people });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, error: 'Error fetching data' }, { status: 500 });
  }
}