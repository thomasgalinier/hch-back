/*
  Warnings:

  - You are about to drop the column `date` on the `Planning` table. All the data in the column will be lost.
  - You are about to drop the column `heure_debut` on the `Planning` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planning" DROP COLUMN "date",
DROP COLUMN "heure_debut",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
