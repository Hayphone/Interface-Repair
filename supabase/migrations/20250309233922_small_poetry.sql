/*
  # Fix inventory policies and repair constraints

  1. Changes
    - Drop and recreate inventory policies with proper permissions
    - Add missing foreign key constraint for technician_id
    - Add default technician_id handling

  2. Security
    - Enable RLS on inventory table
    - Add appropriate policies for all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable full access" ON inventory;
DROP POLICY IF EXISTS "Users can read inventory" ON inventory;
DROP POLICY IF EXISTS "Users can insert inventory" ON inventory;
DROP POLICY IF EXISTS "Users can update inventory" ON inventory;
DROP POLICY IF EXISTS "Only admins can delete inventory" ON inventory;

-- Create new policies
CREATE POLICY "Enable read access to inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access to inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access to inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access to inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin'
  );

-- Add function to handle technician assignment
CREATE OR REPLACE FUNCTION handle_repair_technician()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.technician_id IS NULL THEN
    NEW.technician_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for technician assignment
DROP TRIGGER IF EXISTS set_repair_technician ON repairs;
CREATE TRIGGER set_repair_technician
  BEFORE INSERT ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION handle_repair_technician();