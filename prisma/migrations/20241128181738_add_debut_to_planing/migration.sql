/*
  Warnings:

  - You are about to drop the column `semaine` on the `Planning` table. All the data in the column will be lost.
  - Added the required column `debut` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planning" DROP COLUMN "semaine",
ADD COLUMN     "debut" INTEGER NOT NULL;
