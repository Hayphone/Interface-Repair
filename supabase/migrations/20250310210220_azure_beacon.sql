/*
  # Correction des politiques RLS pour la table repairs

  1. Modifications
    - Désactivation temporaire de RLS sur la table repairs
    - Suppression des anciennes politiques
    - Création de nouvelles politiques permettant toutes les opérations
  
  2. Sécurité
    - Permettre toutes les opérations CRUD sans authentification
*/

-- Désactiver temporairement RLS
ALTER TABLE repairs DISABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Role-based repair access" ON repairs;
DROP POLICY IF EXISTS "Technicians can insert repairs" ON repairs;
DROP POLICY IF EXISTS "Technicians can update repairs" ON repairs;
DROP POLICY IF EXISTS "Users can insert repairs" ON repairs;
DROP POLICY IF EXISTS "Users can view their own repairs" ON repairs;

-- Réactiver RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Créer une nouvelle politique permettant toutes les opérations
CREATE POLICY "Enable all access for repairs"
ON repairs
FOR ALL
USING (true)
WITH CHECK (true);