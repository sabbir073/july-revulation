/*
  Warnings:

  - You are about to drop the column `how_died` on the `People` table. All the data in the column will be lost.
  - You are about to drop the column `how_injured` on the `People` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "People" DROP COLUMN "how_died",
DROP COLUMN "how_injured",
ADD COLUMN     "date_of_death" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;
