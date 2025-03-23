/*
  # Fix Repairs Table RLS and Policies

  1. Changes
    - Drop existing policies
    - Enable RLS
    - Add new policies for CRUD operations
    - Set up default technician handling

  2. Security
    - All authenticated users can view repairs
    - All authenticated users can create repairs
    - Only admins/technicians can update/delete repairs
*/

-- Drop existing policies individually
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

-- Set up default technician handling
CREATE OR REPLACE FUNCTION handle_repair_technician()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.technician_id IS NULL THEN
    NEW.technician_id := '00000000-0000-0000-0000-000000000000';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS set_repair_technician ON repairs;
CREATE TRIGGER set_repair_technician
  BEFORE INSERT ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION handle_repair_technician();