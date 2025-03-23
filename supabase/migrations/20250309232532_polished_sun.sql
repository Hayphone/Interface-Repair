/*
  # Add IMEI check history tracking

  1. New Tables
    - `imei_checks`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `imei` (text, nullable)
      - `serial_number` (text, nullable)
      - `device_id` (uuid, nullable, references devices)
      - `result` (jsonb, nullable)
      - `status` (text, default 'pending')
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `imei_checks` table
    - Add policies for authenticated users to:
      - Insert their own checks
      - View their own checks
      - Update their own checks
*/

DO $$ BEGIN
  -- Create table if it doesn't exist
  CREATE TABLE IF NOT EXISTS imei_checks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    imei text,
    serial_number text,
    device_id uuid REFERENCES devices(id),
    result jsonb,
    status text DEFAULT 'pending',
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id)
  );

  -- Enable RLS
  ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'imei_checks' AND policyname = 'Users can insert own checks'
  ) THEN
    CREATE POLICY "Users can insert own checks"
      ON imei_checks
      FOR INSERT
      TO authenticated
      WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL AND auth.uid() IS NOT NULL));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'imei_checks' AND policyname = 'Users can update own checks'
  ) THEN
    CREATE POLICY "Users can update own checks"
      ON imei_checks
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'imei_checks' AND policyname = 'Users can view own checks'
  ) THEN
    CREATE POLICY "Users can view own checks"
      ON imei_checks
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'imei_checks' AND indexname = 'idx_imei_checks_created_at'
  ) THEN
    CREATE INDEX idx_imei_checks_created_at ON imei_checks (created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'imei_checks' AND indexname = 'idx_imei_checks_device_id'
  ) THEN
    CREATE INDEX idx_imei_checks_device_id ON imei_checks (device_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'imei_checks' AND indexname = 'idx_imei_checks_user_id'
  ) THEN
    CREATE INDEX idx_imei_checks_user_id ON imei_checks (user_id);
  END IF;
END $$;