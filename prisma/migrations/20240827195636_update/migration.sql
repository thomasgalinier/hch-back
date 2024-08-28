/*
  Warnings:

  - You are about to drop the column `zone_id` on the `Technicien` table. All the data in the column will be lost.
  - Added the required column `telephone` to the `Technicien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicien_id` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Technicien" DROP CONSTRAINT "Technicien_zone_id_fkey";

-- AlterTable
ALTER TABLE "Technicien" DROP COLUMN "zone_id",
ADD COLUMN     "telephone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "technicien_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_TechnicienToZone" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TechnicienToZone_AB_unique" ON "_TechnicienToZone"("A", "B");

-- CreateIndex
CREATE INDEX "_TechnicienToZone_B_index" ON "_TechnicienToZone"("B");

-- AddForeignKey
ALTER TABLE "_TechnicienToZone" ADD CONSTRAINT "_TechnicienToZone_A_fkey" FOREIGN KEY ("A") REFERENCES "Technicien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnicienToZone" ADD CONSTRAINT "_TechnicienToZone_B_fkey" FOREIGN KEY ("B") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
