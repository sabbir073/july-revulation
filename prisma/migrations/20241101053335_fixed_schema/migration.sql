/*
  Warnings:

  - You are about to drop the column `story_id` on the `People` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "People" DROP CONSTRAINT "People_story_id_fkey";

-- AlterTable
ALTER TABLE "People" DROP COLUMN "story_id",
ADD COLUMN     "story" TEXT;
