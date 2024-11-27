-- AlterTable
ALTER TABLE "People" ADD COLUMN     "updated_by_id" INTEGER;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
