/*
  # Fix Repairs Table RLS Policies

  1. Changes
    - Drop existing RLS policies on repairs table
    - Create new policies with proper permissions
    - Add default technician handling

  2. Security
    - Enable RLS on repairs table
    - Allow authenticated users to:
      - View all repairs
      - Create new repairs
      - Update repairs (with proper role)
      - Delete repairs (with proper role)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "repairs_view_policy" ON repairs;
DROP POLICY IF EXISTS "repairs_create_policy" ON repairs;
DROP POLICY IF EXISTS "repairs_update_policy" ON repairs;
DROP POLICY IF EXISTS "repairs_delete_policy" ON repairs;
DROP POLICY IF EXISTS "Enable read access to repairs" ON repairs;
DROP POLICY IF EXISTS "Enable insert access to repairs" ON repairs;
DROP POLICY IF EXISTS "Enable delete access to repairs" ON repairs;
DROP POLICY IF EXISTS "Enable update access to repairs" ON repairs;

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "repairs_view_policy"
ON repairs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "repairs_create_policy"
ON repairs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "repairs_update_policy"
ON repairs FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'technician')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'technician')
  )
);

CREATE POLICY "repairs_delete_policy"
ON repairs FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'technician')
  )
);

-- Create or replace the default technician trigger function
CREATE OR REPLACE FUNCTION handle_repair_technician()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.technician_id IS NULL THEN
    NEW.technician_id := '00000000-0000-0000-0000-000000000000';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS set_repair_technician ON repairs;
CREATE TRIGGER set_repair_technician
  BEFORE INSERT ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION handle_repair_technician();