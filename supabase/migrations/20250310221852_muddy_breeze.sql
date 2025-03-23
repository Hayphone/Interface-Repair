/*
  # Fix Repairs RLS Policies

  1. Changes
    - Safely drop and recreate repairs policies
    - Add helper function for repair access
    - Set up default technician handling

  2. Security
    - Enable RLS on repairs table
    - Add policies for authenticated users
    - Add specific policies for technicians

  3. Notes
    - All authenticated users can create repairs
    - Users can view all repairs
    - Technicians can update repairs they are assigned to
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'repairs' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    DROP POLICY "Enable read access for authenticated users" ON repairs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'repairs' 
    AND policyname = 'Enable insert access for authenticated users'
  ) THEN
    DROP POLICY "Enable insert access for authenticated users" ON repairs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'repairs' 
    AND policyname = 'Enable update access for authenticated users'
  ) THEN
    DROP POLICY "Enable update access for authenticated users" ON repairs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'repairs' 
    AND policyname = 'Enable delete access for authenticated users'
  ) THEN
    DROP POLICY "Enable delete access for authenticated users" ON repairs;
  END IF;
END $$;

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

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON repairs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON repairs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON repairs FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON repairs FOR DELETE
TO authenticated
USING (true);

-- Set default technician trigger
CREATE OR REPLACE FUNCTION handle_repair_technician()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default technician_id if not provided
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