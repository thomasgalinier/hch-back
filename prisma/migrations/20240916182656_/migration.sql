/*
  Warnings:

  - Added the required column `telephone` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "telephone" TEXT NOT NULL;
