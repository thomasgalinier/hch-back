/*
  Warnings:

  - Added the required column `id_model` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planning" ADD COLUMN     "id_model" TEXT NOT NULL;
