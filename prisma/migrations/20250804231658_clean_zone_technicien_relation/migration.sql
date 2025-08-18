/*
  Warnings:

  - You are about to drop the column `id_technicien` on the `Zone` table. All the data in the column will be lost.
  - Added the required column `color` to the `Intervention` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Intervention" ADD COLUMN     "color" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zone" DROP COLUMN "id_technicien";
