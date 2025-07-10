/*
  Warnings:

  - Added the required column `fin` to the `Intervention` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Intervention" ADD COLUMN     "fin" TIMESTAMP(3) NOT NULL;
