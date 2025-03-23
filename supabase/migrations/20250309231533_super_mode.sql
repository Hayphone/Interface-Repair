/*
  # Fix IMEI Checks RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies with proper user authentication checks
    - Ensure users can only access their own records

  2. Security
    - Enable RLS
    - Add policies for insert, select, and update operations
    - Enforce user-based access control
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON imei_checks;
  DROP POLICY IF EXISTS "Enable read access for user's own records" ON imei_checks;
  DROP POLICY IF EXISTS "Enable update for user's own records" ON imei_checks;
  DROP POLICY IF EXISTS "Users can insert imei checks" ON imei_checks;
  DROP POLICY IF EXISTS "Users can read all imei checks" ON imei_checks;
  DROP POLICY IF EXISTS "Users can update own imei checks" ON imei_checks;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS imei_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  imei text,
  serial_number text,
  device_id uuid REFERENCES devices(id),
  result jsonb,
  status text DEFAULT 'pending',
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT check_identifier CHECK (
    (imei IS NOT NULL AND serial_number IS NULL) OR
    (imei IS NULL AND serial_number IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can insert own checks"
  ON imei_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own checks"
  ON imei_checks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own checks"
  ON imei_checks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_imei_checks_user_id ON imei_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_imei_checks_created_at ON imei_checks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imei_checks_device_id ON imei_checks(device_id);