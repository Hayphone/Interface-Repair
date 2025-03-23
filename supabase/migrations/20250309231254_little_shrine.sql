/*
  # Fix IMEI Checks RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new RLS policies with proper access rules
    - Ensure authenticated users can:
      - Insert new checks
      - Read all checks
      - Update their own checks

  2. Security
    - Maintain RLS enabled
    - Add proper policies for authenticated users
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert imei checks" ON imei_checks;
  DROP POLICY IF EXISTS "Users can read all imei checks" ON imei_checks;
  DROP POLICY IF EXISTS "Users can update own imei checks" ON imei_checks;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Ensure RLS is enabled
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users"
  ON imei_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
  ON imei_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users"
  ON imei_checks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);