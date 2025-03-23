/*
  # Ajout des colonnes pour la table clients

  1. Nouvelles Colonnes
    - `city` (ville)
    - `postal_code` (code postal)
    - `country` (pays)
    - `status` (statut)

  2. Modifications
    - Ajout des nouvelles colonnes à la table `customers`
    - Définition des valeurs par défaut appropriées
    - Maintien des contraintes existantes
*/

DO $$ 
BEGIN
  -- Ajout de la colonne ville
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'city'
  ) THEN
    ALTER TABLE customers ADD COLUMN city text;
  END IF;

  -- Ajout de la colonne code postal
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE customers ADD COLUMN postal_code text;
  END IF;

  -- Ajout de la colonne pays
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'country'
  ) THEN
    ALTER TABLE customers ADD COLUMN country text DEFAULT 'FR';
  END IF;

  -- Ajout de la colonne statut
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'customers' AND column_name = 'status'
  ) THEN
    ALTER TABLE customers ADD COLUMN status text DEFAULT 'à jour';
  END IF;
END $$;