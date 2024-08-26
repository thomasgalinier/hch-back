-- CreateTable
CREATE TABLE "Administrateur" (
    "id" TEXT NOT NULL,
    "entreprise_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Administrateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technicien" (
    "id" TEXT NOT NULL,
    "entreprise_id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Technicien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "code_postal" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cycle" (
    "id" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intervention" (
    "id" TEXT NOT NULL,
    "forfait_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "technicien_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "statut" TEXT NOT NULL,

    CONSTRAINT "Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit_Intervention" (
    "id" TEXT NOT NULL,
    "produit_id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "Produit_Intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commentaire" (
    "id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forfait" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "categorie_velo" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,

    CONSTRAINT "Forfait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modele" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,

    CONSTRAINT "Modele_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planning" (
    "id" TEXT NOT NULL,
    "technicien_id" TEXT NOT NULL,
    "semaine" INTEGER NOT NULL,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model_Planning" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "planning_id" TEXT NOT NULL,

    CONSTRAINT "Model_Planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "polygone" JSONB NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "sous_domaine" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "couleur_principale" TEXT NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrateur_email_key" ON "Administrateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Technicien_email_key" ON "Technicien"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Administrateur" ADD CONSTRAINT "Administrateur_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technicien" ADD CONSTRAINT "Technicien_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "Entreprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technicien" ADD CONSTRAINT "Technicien_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cycle" ADD CONSTRAINT "Cycle_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_forfait_id_fkey" FOREIGN KEY ("forfait_id") REFERENCES "Forfait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intervention" ADD CONSTRAINT "Intervention_technicien_id_fkey" FOREIGN KEY ("technicien_id") REFERENCES "Technicien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit_Intervention" ADD CONSTRAINT "Produit_Intervention_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produit_Intervention" ADD CONSTRAINT "Produit_Intervention_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "Intervention"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forfait" ADD CONSTRAINT "Forfait_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Modele"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_technicien_id_fkey" FOREIGN KEY ("technicien_id") REFERENCES "Technicien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model_Planning" ADD CONSTRAINT "Model_Planning_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "Modele"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model_Planning" ADD CONSTRAINT "Model_Planning_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "Planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
