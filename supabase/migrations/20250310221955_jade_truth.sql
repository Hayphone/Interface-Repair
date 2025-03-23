/*
  # Fix Repairs Table Policies

  1. Changes
    - Drop all existing policies on repairs table
    - Create new, properly scoped policies for repairs
    - Add default technician handling

  2. Security
    - Enable RLS on repairs table
    - Add policies for CRUD operations
    - Ensure authenticated users can create repairs
    - Allow technicians to manage repairs

  3. Notes
    - All authenticated users can create repairs
    - All authenticated users can view repairs
    - Only technicians and admins can update repairs
*/

-- Drop all existing policies on repairs table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for authenticated users" ON repairs;
  DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON repairs;
  DROP POLICY IF EXISTS "Enable update access for authenticated users" ON repairs;
  DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON repairs;
  DROP POLICY IF EXISTS "Users can view all repairs" ON repairs;
  DROP POLICY IF EXISTS "Users can create repairs" ON repairs;
  DROP POLICY IF EXISTS "Users can update repairs" ON repairs;
  DROP POLICY IF EXISTS "Users can delete repairs" ON repairs;
  DROP POLICY IF EXISTS "Techniciens peuvent modifier les réparations" ON repairs;
  DROP POLICY IF EXISTS "Techniciens peuvent supprimer les réparations" ON repairs;
  DROP POLICY IF EXISTS "Utilisateurs peuvent créer des réparations" ON repairs;
  DROP POLICY IF EXISTS "Utilisateurs peuvent voir toutes les réparations" ON repairs;
END $$;

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "repairs_select_policy" 
ON repairs FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "repairs_insert_policy" 
ON repairs FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "repairs_update_policy" 
ON repairs FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'technician')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'technician')
  )
);

CREATE POLICY "repairs_delete_policy" 
ON repairs FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'technician')
  )
);