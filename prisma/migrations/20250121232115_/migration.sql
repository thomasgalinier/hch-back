/*
  Warnings:

  - You are about to drop the column `model_id` on the `Forfait` table. All the data in the column will be lost.
  - You are about to drop the `Model_Planning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Modele` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Planning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Forfait" DROP CONSTRAINT "Forfait_model_id_fkey";

-- DropForeignKey
ALTER TABLE "Model_Planning" DROP CONSTRAINT "Model_Planning_id_model_fkey";

-- DropForeignKey
ALTER TABLE "Model_Planning" DROP CONSTRAINT "Model_Planning_id_planning_fkey";

-- DropForeignKey
ALTER TABLE "Planning" DROP CONSTRAINT "Planning_id_technicien_fkey";

-- AlterTable
ALTER TABLE "Forfait" DROP COLUMN "model_id";

-- DropTable
DROP TABLE "Model_Planning";

-- DropTable
DROP TABLE "Modele";

-- DropTable
DROP TABLE "Planning";

-- CreateTable
CREATE TABLE "Forfait_Intervention" (
    "id" TEXT NOT NULL,
    "id_forfait" TEXT NOT NULL,
    "id_intervention" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "duree" INTEGER NOT NULL,

    CONSTRAINT "Forfait_Intervention_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Forfait_Intervention" ADD CONSTRAINT "Forfait_Intervention_id_forfait_fkey" FOREIGN KEY ("id_forfait") REFERENCES "Forfait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forfait_Intervention" ADD CONSTRAINT "Forfait_Intervention_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
