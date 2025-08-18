-- Migration: one_zone_per_technicien (version robuste/idempotente)
-- Objectif: imposer qu'un technicien ne puisse être lié qu'à une seule zone (1-1)

-- 1. Ajouter la colonne si elle n'existe pas
ALTER TABLE "Zone" ADD COLUMN IF NOT EXISTS "technicien_id" TEXT;

-- 2. Peupler la colonne à partir de l'ancienne table de jointure many-to-many si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = '_UtilisateurToZone'
  ) THEN
    -- Pour chaque technicien (colonne A), on choisit une zone (la plus petite id) et on l'assigne
    WITH user_choice AS (
      SELECT "A" AS utilisateur_id, MIN("B") AS zone_id
      FROM "_UtilisateurToZone"
      GROUP BY "A"
    )
    UPDATE "Zone" z
    SET technicien_id = uc.utilisateur_id
    FROM user_choice uc
    WHERE z.id = uc.zone_id
      AND z.technicien_id IS NULL; -- Ne pas écraser si déjà set
  END IF;
END $$;

-- 3. Nettoyer les doublons potentiels (au cas où la colonne existait déjà avec plusieurs zones pointant vers le même technicien)
WITH ranked AS (
  SELECT id, technicien_id,
         ROW_NUMBER() OVER (PARTITION BY technicien_id ORDER BY id) AS rn
  FROM "Zone"
  WHERE technicien_id IS NOT NULL
)
UPDATE "Zone" z
SET technicien_id = NULL
FROM ranked r
WHERE z.id = r.id AND r.rn > 1;

-- 4. Ajouter la contrainte UNIQUE si absente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Zone_technicien_id_key'
  ) THEN
    ALTER TABLE "Zone" ADD CONSTRAINT "Zone_technicien_id_key" UNIQUE (technicien_id);
  END IF;
END $$;

-- 5. Ajouter la contrainte de clé étrangère si absente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Zone_technicien_id_fkey'
  ) THEN
    ALTER TABLE "Zone" ADD CONSTRAINT "Zone_technicien_id_fkey"
      FOREIGN KEY (technicien_id) REFERENCES "Utilisateur"(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 6. Supprimer l'ancienne table de jointure si elle existe (nettoyage)
DROP TABLE IF EXISTS "_UtilisateurToZone";
