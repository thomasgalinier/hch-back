/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Planning` table. All the data in the column will be lost.
  - Added the required column `debut` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fin` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planning" DROP COLUMN "dateTime",
ADD COLUMN     "debut" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fin" TIMESTAMP(3) NOT NULL;
