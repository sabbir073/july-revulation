/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma"; // Your prisma client path
import { parse } from "csv-parse";
import { PassThrough } from "stream";

// This route does everything in one pass—no progress store or jobId
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const submittedById = formData.get("submitted_by_id") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }
    if (!submittedById) {
      return NextResponse.json(
        { success: false, error: "Missing submitted_by_id" },
        { status: 400 }
      );
    }

    // Convert the File to a Node.js readable stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // We'll parse the buffer and bulk insert all rows before returning a response
    const pass = new PassThrough();
    pass.end(buffer);

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // We'll use a buffer to batch inserts if you prefer (optional).
    let rowsBuffer: any[] = [];
    const CHUNK_SIZE = 1000;

    // "readable" is triggered each time there's a new chunk of rows
    parser.on("readable", async () => {
      let record;
      while ((record = parser.read()) !== null) {
        rowsBuffer.push(record);

        // If buffer hits CHUNK_SIZE, do a bulk insert
        if (rowsBuffer.length >= CHUNK_SIZE) {
          await bulkInsert(rowsBuffer, submittedById);
          rowsBuffer = [];
        }
      }
    });

    // If there's a parse error, catch it
    parser.on("error", (err) => {
      console.error("CSV parse error:", err);
      throw err;
    });

    // Once the stream ends, insert remaining rows
    const finishedParsing = new Promise<void>((resolve, reject) => {
      parser.on("end", async () => {
        try {
          if (rowsBuffer.length > 0) {
            await bulkInsert(rowsBuffer, submittedById);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });

    // Pipe in data to start parsing
    pass.pipe(parser);

    // Wait until CSV parsing & insertion fully completes
    await finishedParsing;

    // Once finished, return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error importing CSV:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate age from a DOB string.
 * If you don't need this, remove or adapt accordingly.
 */
function calculateAge(dobString: any) {
  const birthDate = new Date(dobString);
  const diffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * Bulk-insert to DB.
 * Uses Prisma createMany with skipDuplicates.
 */
async function bulkInsert(records: any[], submittedById: string) {
  const preparedData = records.map((row) => ({
    name: row.name || null,
    age: row.Dob ? calculateAge(row.Dob) : null,
    occupation_id: row.occupation_id ? Number(row.occupation_id) : null,
    institution_id: row.institution_id ? Number(row.institution_id) : null,
    address: row.address || null,
    permanent_address: row.permanent_address || null,
    nid: row.nid || null,
    fathers_name: row.fathers_name || null,
    mothers_name: row.mothers_name || null,
    date: row.date ? new Date(row.date) : null,
    date_of_death: row.date_of_death ? new Date(row.date_of_death) : null,
    gender: row.gender || null,
    story: row.story || null,
    family_member_contact: row.family_member_contact || null,
    profile_picture: row.profile_picture || null,
    gallery: row.gallery ? row.gallery.split(",") : [],
    incident_location_id: row.incident_location_id
      ? Number(row.incident_location_id)
      : null,
    incident_type: row.incident_type || "INJURED",
    status: row.status || "PENDING",
    documentary: row.documentary || null,
    submitted_by_id: Number(submittedById),
  }));

  await prisma.people.createMany({
    data: preparedData,
    skipDuplicates: true,
  });
}
