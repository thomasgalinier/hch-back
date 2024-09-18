/*
  Warnings:

  - You are about to drop the column `code_postal` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `Client` table. All the data in the column will be lost.
  - Added the required column `coordonnees` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "code_postal",
DROP COLUMN "ville",
ADD COLUMN     "coordonnees" JSONB NOT NULL;
