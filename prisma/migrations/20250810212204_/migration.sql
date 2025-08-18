-- AlterEnum
ALTER TYPE "public"."InterventionStatut" ADD VALUE 'UNPLANNED';

-- DropForeignKey
ALTER TABLE "public"."Intervention" DROP CONSTRAINT "Intervention_client_id_fkey";

-- AlterTable
ALTER TABLE "public"."Intervention" ALTER COLUMN "client_id" DROP NOT NULL,
ALTER COLUMN "adresse" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Intervention" ADD CONSTRAINT "Intervention_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."Utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
