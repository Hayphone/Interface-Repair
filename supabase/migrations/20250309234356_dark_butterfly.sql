/*
  # Add RLS policies for inventory table

  1. Security Changes
    - Enable RLS on inventory table
    - Add policies for:
      - Authenticated users can read all inventory items
      - Authenticated users can insert new inventory items
      - Authenticated users can update inventory quantities
      - Only admins can delete inventory items

  2. Notes
    - All authenticated users need read access to inventory for repair management
    - Quantity updates are essential for tracking stock levels
    - Only admins should be able to completely remove items
*/

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all inventory items
CREATE POLICY "Users can view all inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert new inventory items
CREATE POLICY "Users can add inventory items"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update inventory quantities
CREATE POLICY "Users can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only admins can delete inventory items
CREATE POLICY "Admins can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (
    (SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'admin'
  );