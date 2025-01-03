/*
  Warnings:

  - Added the required column `fin` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_model` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `debut` on the `Planning` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Planning" ADD COLUMN     "fin" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_model" TEXT NOT NULL,
DROP COLUMN "debut",
ADD COLUMN     "debut" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "_UtilisateurToZone" ADD CONSTRAINT "_UtilisateurToZone_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UtilisateurToZone_AB_unique";
