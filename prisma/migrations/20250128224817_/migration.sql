/*
  Warnings:

  - Added the required column `formatted_duree` to the `Forfait` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Forfait" ADD COLUMN     "formatted_duree" INTEGER NOT NULL,
ALTER COLUMN "duree" SET DATA TYPE TEXT;
