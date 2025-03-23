/*
  # Fix inventory table RLS policies

  1. Changes
    - Drop existing policies on inventory table
    - Add new policies for:
      - SELECT: Authenticated users can read all inventory items
      - INSERT: Authenticated users can insert new items
      - UPDATE: Authenticated users can update quantities
      - DELETE: Only admins can delete items

  2. Security
    - Enable RLS on inventory table (if not already enabled)
    - Add appropriate policies for CRUD operations
*/

-- Enable RLS if not already enabled
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable full access" ON inventory;
DROP POLICY IF EXISTS "Admin inventory management" ON inventory;
DROP POLICY IF EXISTS "Role-based inventory access" ON inventory;
DROP POLICY IF EXISTS "Users can insert inventory" ON inventory;

-- Create new policies
CREATE POLICY "Users can read inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only admins can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin'
  );