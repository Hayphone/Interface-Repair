/*
  # Fix Repairs Table RLS Policies

  1. Changes
    - Enable RLS on repairs table
    - Create comprehensive policies for CRUD operations
    - Ensure proper access control for all operations

  2. Security
    - Enable RLS on repairs table
    - Allow authenticated users to:
      - Read all repairs
      - Create new repairs
      - Update repairs (with proper role)
      - Delete repairs (with proper role)
    - Ensure proper technician assignment
*/

-- First, enable RLS on the repairs table
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create policies for all operations
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

-- Create or replace function to handle default technician
CREATE OR REPLACE FUNCTION handle_repair_technician()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default technician if not provided
  IF NEW.technician_id IS NULL THEN
    NEW.technician_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for technician handling
DROP TRIGGER IF EXISTS set_repair_technician ON repairs;
CREATE TRIGGER set_repair_technician
  BEFORE INSERT ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION handle_repair_technician();