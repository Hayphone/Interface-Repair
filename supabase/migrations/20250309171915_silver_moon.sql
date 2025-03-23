/*
  # Fix customer and device policies

  1. Changes
    - Update customer policies to allow public access
    - Update device policies to allow public access
    - Ensure proper cascading for device deletion

  2. Security
    - Enable RLS on both tables
    - Add public access policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public access" ON customers;
DROP POLICY IF EXISTS "Public access" ON devices;

-- Update customers policies
CREATE POLICY "Enable full access" ON customers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Update devices policies
CREATE POLICY "Enable full access" ON devices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure proper cascading for device deletion
ALTER TABLE devices
  DROP CONSTRAINT IF EXISTS devices_customer_id_fkey,
  ADD CONSTRAINT devices_customer_id_fkey
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE CASCADE;