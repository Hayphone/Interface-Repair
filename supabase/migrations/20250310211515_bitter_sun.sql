/*
  # Sauvegarder la solution de réparation et prévenir les erreurs futures

  1. Changements
    - Ajouter des politiques RLS pour la table repairs
    - Ajouter une fonction pour vérifier l'accès aux réparations
    - Mettre à jour les contraintes de la table repairs
  
  2. Sécurité
    - Permettre aux utilisateurs authentifiés de créer des réparations
    - Permettre aux techniciens de gérer les réparations
    - Assurer que le technicien par défaut existe toujours
*/

-- Fonction pour vérifier l'accès aux réparations
CREATE OR REPLACE FUNCTION public.has_repair_access()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'technician')
  );
$$;

-- Activer RLS sur la table repairs
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Politique pour la création de réparations
CREATE POLICY "Utilisateurs peuvent créer des réparations"
ON repairs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Politique pour la lecture des réparations
CREATE POLICY "Utilisateurs peuvent voir toutes les réparations"
ON repairs
FOR SELECT
TO authenticated
USING (true);

-- Politique pour la modification des réparations
CREATE POLICY "Techniciens peuvent modifier les réparations"
ON repairs
FOR UPDATE
TO authenticated
USING (has_repair_access())
WITH CHECK (has_repair_access());

-- Politique pour la suppression des réparations
CREATE POLICY "Techniciens peuvent supprimer les réparations"
ON repairs
FOR DELETE
TO authenticated
USING (has_repair_access());

-- Assurer que le technicien par défaut existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = '00000000-0000-0000-0000-000000000000'
  ) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      'system@smartdiscount31.fr',
      '',
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"system","providers":["system"]}',
      '{"name":"System User"}',
      false,
      'authenticated'
    );
  END IF;
END $$;

-- Assurer que le technicien par défaut a le rôle admin
INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Mettre à jour les réparations existantes
UPDATE repairs
SET technician_id = '00000000-0000-0000-0000-000000000000'
WHERE technician_id IS NULL;