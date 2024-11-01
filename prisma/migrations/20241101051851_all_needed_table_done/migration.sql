/*
  Warnings:

  - You are about to drop the column `forget_password_token` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('DEATH', 'INJURED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'VERIFIED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "forget_password_token";

-- CreateTable
CREATE TABLE "People" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "occupation_id" INTEGER,
    "institution_id" INTEGER,
    "address" TEXT,
    "fathers_name" TEXT,
    "mothers_name" TEXT,
    "date" TIMESTAMP(3),
    "how_died" TEXT,
    "how_injured" TEXT,
    "story_id" INTEGER,
    "family_member_contact" TEXT,
    "profile_picture" TEXT,
    "gallery_id" INTEGER,
    "incident_location_id" INTEGER,
    "incident_type" "IncidentType" NOT NULL,
    "status" "Status" NOT NULL,
    "documentary_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "submitted_by_id" INTEGER NOT NULL,

    CONSTRAINT "People_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occupation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoGallery" (
    "id" SERIAL NOT NULL,
    "gallery_images" TEXT[],
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentLocation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documentary" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documentary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "Occupation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "PhotoGallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_incident_location_id_fkey" FOREIGN KEY ("incident_location_id") REFERENCES "IncidentLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_documentary_id_fkey" FOREIGN KEY ("documentary_id") REFERENCES "Documentary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occupation" ADD CONSTRAINT "Occupation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoGallery" ADD CONSTRAINT "PhotoGallery_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentLocation" ADD CONSTRAINT "IncidentLocation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentary" ADD CONSTRAINT "Documentary_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
