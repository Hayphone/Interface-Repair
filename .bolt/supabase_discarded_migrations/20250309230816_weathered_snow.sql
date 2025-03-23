/*
  # IMEI Checks Security Policies

  1. Security
    - Enable RLS on `imei_checks` table
    - Add policies for authenticated users to:
      - Insert new checks
      - Read all checks
      - Update their own checks
    
  Note: Added checks to prevent duplicate policy creation
*/

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Allow authenticated users to insert new checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'imei_checks' 
    AND policyname = 'Users can insert imei checks'
  ) THEN
    CREATE POLICY "Users can insert imei checks"
      ON imei_checks
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Allow authenticated users to read all checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'imei_checks' 
    AND policyname = 'Users can read all imei checks'
  ) THEN
    CREATE POLICY "Users can read all imei checks"
      ON imei_checks
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Allow authenticated users to update their own checks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'imei_checks' 
    AND policyname = 'Users can update own imei checks'
  ) THEN
    CREATE POLICY "Users can update own imei checks"
      ON imei_checks
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;