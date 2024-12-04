/*
  Warnings:

  - You are about to drop the column `debut` on the `Planning` table. All the data in the column will be lost.
  - Added the required column `date` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heure_debut` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planning" DROP COLUMN "debut",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "heure_debut" INTEGER NOT NULL;
