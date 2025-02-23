/*
  Warnings:

  - You are about to drop the column `nom` on the `Forfait` table. All the data in the column will be lost.
  - Added the required column `duree` to the `Forfait` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titre` to the `Forfait` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Forfait" DROP COLUMN "nom",
ADD COLUMN     "duree" INTEGER NOT NULL,
ADD COLUMN     "titre" TEXT NOT NULL;
