/*
  # Fix IMEI Checks Table RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Enable RLS on the table
    - Create new policies for authenticated users
    - Allow authenticated users to:
      - Insert new checks
      - Read their own checks
      - Update their own checks

  2. Security
    - Ensure users can only access their own records
    - Maintain data privacy between users
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable insert for authenticated users" ON imei_checks;
  DROP POLICY IF EXISTS "Enable read access for authenticated users" ON imei_checks;
  DROP POLICY IF EXISTS "Enable update for authenticated users" ON imei_checks;
  DROP POLICY IF EXISTS "Users can insert imei checks" ON imei_checks;
  DROP POLICY IF EXISTS "Users can read all imei checks" ON imei_checks;
  DROP POLICY IF EXISTS "Users can update own imei checks" ON imei_checks;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'imei_checks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE imei_checks ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Set default value for user_id to the authenticated user
ALTER TABLE imei_checks ALTER COLUMN user_id SET DEFAULT auth.uid();

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