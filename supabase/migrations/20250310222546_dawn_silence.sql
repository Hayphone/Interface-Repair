/*
  # Fix Repairs RLS Policies

  1. Changes
    - Drop existing RLS policies on repairs table
    - Enable RLS on repairs table
    - Create new, more permissive policies for repairs table
    - Add helper function for checking repair access

  2. Security
    - Enable RLS on repairs table
    - Add policies for:
      - View: All authenticated users
      - Create: All authenticated users
      - Update: Admins and technicians
      - Delete: Admins and technicians
*/

-- Drop existing policies
DROP POLICY IF EXISTS "repairs_view_policy" ON repairs;
DROP POLICY IF EXISTS "repairs_create_policy" ON repairs;
DROP POLICY IF EXISTS "repairs_update_policy" ON repairs;
DROP POLICY IF EXISTS "repairs_delete_policy" ON repairs;

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create helper function for repair access
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

-- Create new policies
CREATE POLICY "repairs_view_policy"
ON repairs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "repairs_create_policy"
ON repairs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "repairs_update_policy"
ON repairs FOR UPDATE
TO authenticated
USING (has_repair_access())
WITH CHECK (has_repair_access());

CREATE POLICY "repairs_delete_policy"
ON repairs FOR DELETE
TO authenticated
USING (has_repair_access());