/*
  # Fix repairs technician_id constraint

  1. Changes
    - Create system user in auth.users
    - Add system user role
    - Modify repairs table technician_id constraint
  
  2. Security
    - Ensure system user exists for default assignments
    - Update foreign key constraint to handle system user
*/

-- Create the system user if it doesn't exist
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
) ON CONFLICT (id) DO NOTHING;

-- Add system user role
INSERT INTO user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id) DO NOTHING;

-- Update repairs table constraint
ALTER TABLE repairs DROP CONSTRAINT IF EXISTS repairs_technician_id_fkey;

ALTER TABLE repairs
ADD CONSTRAINT repairs_technician_id_fkey
FOREIGN KEY (technician_id)
REFERENCES auth.users(id)
ON DELETE SET DEFAULT;

-- Set default technician_id
ALTER TABLE repairs
ALTER COLUMN technician_id
SET DEFAULT '00000000-0000-0000-0000-000000000000';

-- Update existing repairs
UPDATE repairs
SET technician_id = '00000000-0000-0000-0000-000000000000'
WHERE technician_id IS NULL;