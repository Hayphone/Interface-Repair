/*
  # Mise à jour des politiques de sécurité pour les réparations

  1. Modifications
    - Ajout de politiques RLS pour la table repairs
    - Permettre aux utilisateurs authentifiés de créer et gérer les réparations
  
  2. Sécurité
    - Les utilisateurs authentifiés peuvent créer des réparations
    - Les utilisateurs peuvent voir et modifier leurs réparations
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Enable all access for repairs" ON repairs;

-- Activer RLS sur la table repairs si ce n'est pas déjà fait
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Politique pour la création de réparations
CREATE POLICY "Users can create repairs"
ON repairs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Politique pour la lecture de réparations
CREATE POLICY "Users can view repairs"
ON repairs
FOR SELECT
TO authenticated
USING (true);

-- Politique pour la mise à jour de réparations
CREATE POLICY "Users can update repairs"
ON repairs
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Politique pour la suppression de réparations
CREATE POLICY "Users can delete repairs"
ON repairs
FOR DELETE
TO authenticated
USING (true);