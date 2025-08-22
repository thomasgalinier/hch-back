-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TECHNICIEN', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."InterventionStatut" AS ENUM ('UNPLANNED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Utilisateur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entreprise_id" TEXT,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entreprise" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "sous_domaine" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "couleur_principale" TEXT NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Forfait_Intervention" (
    "id" TEXT NOT NULL,
    "id_forfait" TEXT NOT NULL,
    "id_intervention" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "duree" INTEGER NOT NULL,

    CONSTRAINT "Forfait_Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Forfait" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "categorie_velo" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "formatted_duree" INTEGER NOT NULL,

    CONSTRAINT "Forfait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Zone" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "polygone" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "technicien_id" TEXT,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Intervention" (
    "id" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT,
    "statut" "public"."InterventionStatut" NOT NULL,
    "client_id" TEXT,
    "technicien_id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "public"."Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_technicien_id_key" ON "public"."Zone"("technicien_id");

-- AddForeignKey
ALTER TABLE "public"."Utilisateur" ADD CONSTRAINT "Utilisateur_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "public"."Entreprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Forfait_Intervention" ADD CONSTRAINT "Forfait_Intervention_id_forfait_fkey" FOREIGN KEY ("id_forfait") REFERENCES "public"."Forfait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Forfait_Intervention" ADD CONSTRAINT "Forfait_Intervention_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "public"."Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Zone" ADD CONSTRAINT "Zone_technicien_id_fkey" FOREIGN KEY ("technicien_id") REFERENCES "public"."Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intervention" ADD CONSTRAINT "Intervention_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intervention" ADD CONSTRAINT "Intervention_technicien_id_fkey" FOREIGN KEY ("technicien_id") REFERENCES "public"."Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intervention" ADD CONSTRAINT "Intervention_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "public"."Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
