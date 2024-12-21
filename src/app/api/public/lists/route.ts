import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { Prisma, IncidentType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  // Query parameters
  const searchQuery = url.searchParams.get("search") || "";
  const age = url.searchParams.get("age");
  const occupation = url.searchParams.get("occupation") || "";
  const gender = url.searchParams.get("gender") || "";
  const incidentType = url.searchParams.get("incidentType") || "";
  const location = url.searchParams.get("location") || "";
  const institution = url.searchParams.get("institution") || "";
  const skip = parseInt(url.searchParams.get("skip") || "0", 10);
  const take = parseInt(url.searchParams.get("take") || "12", 10);

  try {
    // Filter conditions
    const filterConditions: Prisma.PeopleWhereInput[] = [
      { status: { equals: "VERIFIED" } },
    ];

    if (age && !isNaN(Number(age))) {
      filterConditions.push({
        OR: [
          { age: { gte: 1, lte: Number(age) } },
          { age: null },
        ],
      });
    }

    if (occupation) {
      filterConditions.push({
        occupation: { title: { contains: occupation, mode: Prisma.QueryMode.insensitive } },
      });
    }

    if (gender) {
      filterConditions.push({
        gender: { equals: gender.toUpperCase() },
      });
    }

    if (incidentType) {
      filterConditions.push({
        incident_type: {
          equals: incidentType === "MARTYR" ? "DEATH" : "INJURED",
        },
      });
    }

    if (institution) {
      filterConditions.push({
        institution: { title: { contains: institution, mode: Prisma.QueryMode.insensitive } },
      });
    }

    if (location) {
      filterConditions.push({
        incident_location: { title: { contains: location, mode: Prisma.QueryMode.insensitive } },
      });
    }

    // Search conditions
    const searchConditions: Prisma.PeopleWhereInput[] = [];
    if (searchQuery) {
      searchConditions.push(
        { name: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
        !isNaN(Number(searchQuery)) ? { age: { equals: Number(searchQuery) } } : {},
        { occupation: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
        { institution: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
        { gender: { equals: searchQuery.toUpperCase() } },
        { incident_location: { title: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } } },
        Object.values(IncidentType).includes(searchQuery.toUpperCase() as IncidentType)
          ? { incident_type: { equals: searchQuery.toUpperCase() as IncidentType } }
          : {}
      );
    }

    // Combine filters
    const whereCondition: Prisma.PeopleWhereInput = {
      AND: [
        ...filterConditions,
        searchConditions.length > 0 ? { OR: searchConditions.filter(Boolean) } : {},
      ].filter(Boolean),
    };

    // Fetch data
    const people = await prisma.people.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        age: true,
        occupation: { select: { title: true } },
        institution: { select: { title: true } },
        date: true,
        date_of_death: true,
        gender: true,
        profile_picture: true,
        incident_location: { select: { title: true } },
        incident_type: true,
      },
      skip,
      take,
      orderBy: { date: "asc" },
    });

    const totalCount = await prisma.people.count({ where: whereCondition });

    return NextResponse.json({ success: true, people: people, totalCount: totalCount });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching data." },
      { status: 500 }
    );
  }
}
