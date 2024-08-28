-- DropForeignKey
ALTER TABLE "Technicien" DROP CONSTRAINT "Technicien_zone_id_fkey";

-- AlterTable
ALTER TABLE "Technicien" ALTER COLUMN "zone_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Technicien" ADD CONSTRAINT "Technicien_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
