/*
  # IMEI Check Integration

  1. New Tables
    - `imei_checks`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `imei` (text, nullable)
      - `serial_number` (text, nullable)
      - `device_id` (uuid, nullable, references devices)
      - `result` (jsonb, nullable)
      - `status` (text)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create IMEI checks table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'imei_check_status') THEN
    CREATE TYPE imei_check_status AS ENUM ('pending', 'success', 'failed', 'error');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS imei_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  imei text,
  serial_number text,
  device_id uuid REFERENCES devices(id) ON DELETE SET NULL,
  result jsonb,
  status text DEFAULT 'pending',
  CONSTRAINT check_identifier CHECK (
    (imei IS NOT NULL) OR (serial_number IS NOT NULL)
  )
);

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