/*
  Warnings:

  - You are about to drop the column `stock` on the `Produit` table. All the data in the column will be lost.
  - Added the required column `categorie` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantite` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produit" DROP COLUMN "stock",
ADD COLUMN     "categorie" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "quantite" INTEGER NOT NULL;
