/*
  # Fix IMEI Checks RLS Policies

  1. Changes
    - Ensure table has proper user_id column and constraints
    - Enable RLS
    - Create proper policies for authenticated users
    - Add performance indexes

  2. Security
    - Enforce user-based access control
    - Ensure users can only access their own records
    - Add proper foreign key constraints
*/

-- Recreate the table with proper structure
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

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own checks" ON imei_checks;
DROP POLICY IF EXISTS "Users can view own checks" ON imei_checks;
DROP POLICY IF EXISTS "Users can update own checks" ON imei_checks;

-- Create new policies
CREATE POLICY "Users can insert own checks"
  ON imei_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR
    (user_id IS NULL AND auth.uid() IS NOT NULL)
  );

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