/*
  Warnings:

  - You are about to drop the column `documentary_id` on the `People` table. All the data in the column will be lost.
  - You are about to drop the column `gallery_id` on the `People` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "People" DROP CONSTRAINT "People_documentary_id_fkey";

-- DropForeignKey
ALTER TABLE "People" DROP CONSTRAINT "People_gallery_id_fkey";

-- AlterTable
ALTER TABLE "People" DROP COLUMN "documentary_id",
DROP COLUMN "gallery_id",
ADD COLUMN     "documentary" TEXT,
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "status" SET DEFAULT 'PENDING';
