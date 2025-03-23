/*
  # Ajout d'un utilisateur par défaut et mise à jour de la contrainte de clé étrangère

  1. Modifications
    - Création d'un utilisateur système par défaut
    - Mise à jour de la contrainte de clé étrangère pour permettre l'utilisation de l'utilisateur par défaut
  
  2. Sécurité
    - L'utilisateur système est utilisé uniquement comme valeur par défaut
    - Maintien de l'intégrité référentielle avec une approche plus flexible
*/

-- Créer l'utilisateur système par défaut s'il n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = '00000000-0000-0000-0000-000000000000'
  ) THEN
    INSERT INTO auth.users (
      id,
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

-- Ajouter le rôle utilisateur s'il n'existe pas
INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'user')
ON CONFLICT (user_id) DO NOTHING;

-- Supprimer l'ancienne contrainte
ALTER TABLE repairs DROP CONSTRAINT IF EXISTS repairs_technician_id_fkey;

-- Ajouter la nouvelle contrainte avec l'utilisateur système par défaut
ALTER TABLE repairs
ADD CONSTRAINT repairs_technician_id_fkey
FOREIGN KEY (technician_id)
REFERENCES auth.users(id)
ON DELETE SET DEFAULT;

-- Définir l'utilisateur système comme valeur par défaut
ALTER TABLE repairs
ALTER COLUMN technician_id
SET DEFAULT '00000000-0000-0000-0000-000000000000';

-- Mettre à jour les réparations existantes sans technicien
UPDATE repairs
SET technician_id = '00000000-0000-0000-0000-000000000000'
WHERE technician_id IS NULL;