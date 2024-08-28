/*
  Warnings:

  - Added the required column `telephone` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `code_postal` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "telephone" TEXT NOT NULL,
DROP COLUMN "code_postal",
ADD COLUMN     "code_postal" INTEGER NOT NULL;
