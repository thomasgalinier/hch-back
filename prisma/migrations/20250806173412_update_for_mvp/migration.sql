/*
  Warnings:

  - You are about to drop the column `color` on the `Intervention` table. All the data in the column will be lost.
  - You are about to drop the column `forfait_id` on the `Intervention` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_id_intervention_fkey";

-- DropForeignKey
ALTER TABLE "Intervention" DROP CONSTRAINT "Intervention_forfait_id_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_id_intervention_fkey";

-- DropForeignKey
ALTER TABLE "Produit_Intervention" DROP CONSTRAINT "Produit_Intervention_id_intervention_fkey";

-- AlterTable
ALTER TABLE "Intervention" DROP COLUMN "color",
DROP COLUMN "forfait_id";
