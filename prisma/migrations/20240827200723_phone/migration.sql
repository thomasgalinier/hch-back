/*
  Warnings:

  - You are about to drop the column `technicien_id` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the `_TechnicienToZone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `zone_id` to the `Technicien` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TechnicienToZone" DROP CONSTRAINT "_TechnicienToZone_A_fkey";

-- DropForeignKey
ALTER TABLE "_TechnicienToZone" DROP CONSTRAINT "_TechnicienToZone_B_fkey";

-- AlterTable
ALTER TABLE "Technicien" ADD COLUMN     "zone_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zone" DROP COLUMN "technicien_id";

-- DropTable
DROP TABLE "_TechnicienToZone";

-- AddForeignKey
ALTER TABLE "Technicien" ADD CONSTRAINT "Technicien_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
