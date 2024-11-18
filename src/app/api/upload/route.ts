import { S3Client, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

// AWS S3 configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET!;

// Helper function to check if file exists in S3
async function fileExists(fileName: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: fileName }));
    return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

// Function to upload a single file to S3
async function uploadFileToS3(file: File, folder: string): Promise<string> {
  let fileName = `${folder}/${file.name}`;

  // Check if the file exists; if so, rename it
  while (await fileExists(fileName)) {
    const uniqueSuffix = nanoid(8);
    fileName = `${folder}/${uniqueSuffix}-${file.name}`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    })
  );

  return fileName;
}

// Server Action for handling file uploads
export async function POST(req: Request) {
  const formData = await req.formData();
  const profilePicture = formData.get("profile_picture") as File | null;
  const galleryFiles = formData.getAll("gallery") as File[]; // Get all files with the name "gallery"

  const uploadedFileNames = { profileName: "", galleryNames: [] as string[] };

  // Upload profile picture
  if (profilePicture) {
    const profileFileName = await uploadFileToS3(profilePicture, "profile_pictures");
    uploadedFileNames.profileName = profileFileName;
  }

  // Upload gallery files
  if (galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      const galleryFileName = await uploadFileToS3(file, "gallery");
      uploadedFileNames.galleryNames.push(galleryFileName);
    }
  }

  return NextResponse.json({ success: true, ...uploadedFileNames });
}

