/*
  # Fix IMEI Checks Table Structure and Policies

  1. Changes
    - Create IMEI checks table if not exists
    - Add proper columns including user_id
    - Enable RLS
    - Create policies for user access control

  2. Security
    - Ensure users can only access their own records
    - Maintain data privacy between users
    - Proper user authentication checks
*/

-- Create type for check status if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'imei_check_status') THEN
    CREATE TYPE imei_check_status AS ENUM ('pending', 'success', 'failed', 'error');
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create or update the imei_checks table
CREATE TABLE IF NOT EXISTS imei_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid(),
  imei text,
  serial_number text,
  result jsonb,
  status text DEFAULT 'pending',
  device_id uuid REFERENCES devices(id),
  CONSTRAINT check_identifier CHECK (
    (imei IS NOT NULL AND serial_number IS NULL) OR
    (imei IS NULL AND serial_number IS NOT NULL)
  )
);

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON imei_checks;
  DROP POLICY IF EXISTS "Enable read access for user's own records" ON imei_checks;
  DROP POLICY IF EXISTS "Enable update for user's own records" ON imei_checks;
  DROP POLICY IF EXISTS "Users can read own imei checks" ON imei_checks;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
  ON imei_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for user's own records"
  ON imei_checks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for user's own records"
  ON imei_checks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_imei_checks_user_id ON imei_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_imei_checks_device_id ON imei_checks(device_id);
CREATE INDEX IF NOT EXISTS idx_imei_checks_created_at ON imei_checks(created_at DESC);

-- Grant necessary permissions
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;