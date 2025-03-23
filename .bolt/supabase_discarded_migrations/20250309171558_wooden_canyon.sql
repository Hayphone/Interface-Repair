/*
  # Remove authentication requirements

  1. Changes
    - Drop existing RLS policies
    - Create new public access policies
    - Remove auth dependencies from functions

  2. Security
    - Enable RLS on all tables
    - Add public access policies
    - This is temporary until authentication is re-implemented
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Role-based customer access" ON customers;
DROP POLICY IF EXISTS "Users can insert customers" ON customers;
DROP POLICY IF EXISTS "Role-based device access" ON devices;
DROP POLICY IF EXISTS "Users can insert devices" ON devices;
DROP POLICY IF EXISTS "Role-based repair access" ON repairs;
DROP POLICY IF EXISTS "Users can insert repairs" ON repairs;
DROP POLICY IF EXISTS "Admin inventory management" ON inventory;
DROP POLICY IF EXISTS "Role-based inventory access" ON inventory;
DROP POLICY IF EXISTS "Users can insert inventory" ON inventory;
DROP POLICY IF EXISTS "Users can insert repair_parts" ON repair_parts;
DROP POLICY IF EXISTS "Users can read all repair_parts" ON repair_parts;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;

-- Create new public access policies
CREATE POLICY "Public access" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON devices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON repairs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON repair_parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON user_roles FOR ALL USING (true) WITH CHECK (true);

-- Drop and recreate has_access function without auth check
CREATE OR REPLACE FUNCTION public.has_access()
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN true;
END;
$$;