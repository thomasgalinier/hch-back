/*
  Warnings:

  - Changed the type of `role` on the `Utilisateur` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TECHNICIEN', 'CLIENT');

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
