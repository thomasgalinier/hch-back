/*
  Warnings:

  - You are about to drop the `Commentaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produit_Intervention` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Commentaire" DROP CONSTRAINT "Commentaire_id_technicien_fkey";

-- DropForeignKey
ALTER TABLE "public"."Produit_Intervention" DROP CONSTRAINT "Produit_Intervention_id_produit_fkey";

-- DropTable
DROP TABLE "public"."Commentaire";

-- DropTable
DROP TABLE "public"."Photo";

-- DropTable
DROP TABLE "public"."Produit";

-- DropTable
DROP TABLE "public"."Produit_Intervention";
