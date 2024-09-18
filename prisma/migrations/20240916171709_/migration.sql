/*
  Warnings:

  - You are about to drop the column `date` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `intervention_id` on the `Commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Intervention` table. All the data in the column will be lost.
  - You are about to drop the column `model_id` on the `Model_Planning` table. All the data in the column will be lost.
  - You are about to drop the column `planning_id` on the `Model_Planning` table. All the data in the column will be lost.
  - You are about to drop the column `intervention_id` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `technicien_id` on the `Planning` table. All the data in the column will be lost.
  - You are about to drop the column `quantite` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `intervention_id` on the `Produit_Intervention` table. All the data in the column will be lost.
  - You are about to drop the column `produit_id` on the `Produit_Intervention` table. All the data in the column will be lost.
  - You are about to drop the `Administrateur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cycle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Technicien` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_intervention` to the `Commentaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_technicien` to the `Commentaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debut` to the `Intervention` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_model` to the `Model_Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_planning` to the `Model_Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_intervention` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_technicien` to the `Planning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_intervention` to the `Produit_Intervention` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_produit` to the `Produit_Intervention` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_technicien` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Administrateur" DROP CONSTRAINT "Administrateur_entreprise_id_fkey";

-- DropForeignKey
ALTER TABLE "Commentaire" DROP CONSTRAINT "Commentaire_intervention_id_fkey";

-- DropForeignKey
ALTER TABLE "Cycle" DROP CONSTRAINT "Cycle_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Intervention" DROP CONSTRAINT "Intervention_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Intervention" DROP CONSTRAINT "Intervention_technicien_id_fkey";

-- DropForeignKey
ALTER TABLE "Model_Planning" DROP CONSTRAINT "Model_Planning_model_id_fkey";

-- DropForeignKey
ALTER TABLE "Model_Planning" DROP CONSTRAINT "Model_Planning_planning_id_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_intervention_id_fkey";

-- DropForeignKey
ALTER TABLE "Planning" DROP CONSTRAINT "Planning_technicien_id_fkey";

-- DropForeignKey
ALTER TABLE "Produit_Intervention" DROP CONSTRAINT "Produit_Intervention_intervention_id_fkey";

-- DropForeignKey
ALTER TABLE "Produit_Intervention" DROP CONSTRAINT "Produit_Intervention_produit_id_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_administrateurId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_clientId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_technicienId_fkey";

-- DropForeignKey
ALTER TABLE "Technicien" DROP CONSTRAINT "Technicien_entreprise_id_fkey";

-- DropForeignKey
ALTER TABLE "Technicien" DROP CONSTRAINT "Technicien_zone_id_fkey";

-- AlterTable
ALTER TABLE "Commentaire" DROP COLUMN "date",
DROP COLUMN "intervention_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_intervention" TEXT NOT NULL,
ADD COLUMN     "id_technicien" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Intervention" DROP COLUMN "date",
ADD COLUMN     "debut" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Model_Planning" DROP COLUMN "model_id",
DROP COLUMN "planning_id",
ADD COLUMN     "id_model" TEXT NOT NULL,
ADD COLUMN     "id_planning" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "intervention_id",
ADD COLUMN     "id_intervention" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Planning" DROP COLUMN "technicien_id",
ADD COLUMN     "id_technicien" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "quantite",
ADD COLUMN     "stock" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Produit_Intervention" DROP COLUMN "intervention_id",
DROP COLUMN "produit_id",
ADD COLUMN     "id_intervention" TEXT NOT NULL,
ADD COLUMN     "id_produit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "id_technicien" TEXT NOT NULL;

-- DropTable
DROP TABLE "Administrateur";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Cycle";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "Technicien";

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entreprise_id" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UtilisateurToZone" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UtilisateurToZone_AB_unique" ON "_UtilisateurToZone"("A", "B");

-- CreateIndex
CREATE INDEX "_UtilisateurToZone_B_index" ON "_UtilisateurToZone"("B");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "Entreprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_technicien_id_fkey" FOREIGN KEY ("technicien_id") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_id_technicien_fkey" FOREIGN KEY ("id_technicien") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit_Intervention" ADD CONSTRAINT "Produit_Intervention_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit_Intervention" ADD CONSTRAINT "Produit_Intervention_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_id_technicien_fkey" FOREIGN KEY ("id_technicien") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model_Planning" ADD CONSTRAINT "Model_Planning_id_model_fkey" FOREIGN KEY ("id_model") REFERENCES "Modele"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model_Planning" ADD CONSTRAINT "Model_Planning_id_planning_fkey" FOREIGN KEY ("id_planning") REFERENCES "Planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UtilisateurToZone" ADD CONSTRAINT "_UtilisateurToZone_A_fkey" FOREIGN KEY ("A") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UtilisateurToZone" ADD CONSTRAINT "_UtilisateurToZone_B_fkey" FOREIGN KEY ("B") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
