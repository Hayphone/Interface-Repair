/*
  # Fix inventory table RLS policies

  1. Security
    - Enable RLS on inventory table
    - Add policies for CRUD operations:
      - All authenticated users can view inventory
      - All authenticated users can add new items
      - All authenticated users can update quantities
      - Only admins can delete items

  2. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies with proper permissions
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies one by one, ignoring errors if they don't exist
  BEGIN
    DROP POLICY IF EXISTS "Users can view all inventory" ON inventory;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Users can add inventory items" ON inventory;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Users can update inventory" ON inventory;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Admins can delete inventory" ON inventory;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
END $$;

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all inventory items
CREATE POLICY "inventory_read_policy"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert new inventory items
CREATE POLICY "inventory_insert_policy"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update inventory quantities
CREATE POLICY "inventory_update_policy"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only admins can delete inventory items
CREATE POLICY "inventory_delete_policy"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );