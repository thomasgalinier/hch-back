/*
  Warnings:

  - Added the required column `updatedAt` to the `Intervention` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statut` on the `Intervention` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InterventionStatut" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Intervention" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "statut",
ADD COLUMN     "statut" "InterventionStatut" NOT NULL;
