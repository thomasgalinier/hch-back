/*
  Warnings:

  - Added the required column `color` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "color" TEXT NOT NULL;
