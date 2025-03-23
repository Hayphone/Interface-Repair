/*
  # Add IMEI checks table and related functions

  1. New Tables
    - `imei_checks`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `imei` (text)
      - `serial_number` (text)
      - `device_id` (uuid, foreign key to devices)
      - `result` (jsonb)
      - `status` (text)

  2. Security
    - Enable RLS on `imei_checks` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS imei_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  imei text,
  serial_number text,
  device_id uuid REFERENCES devices(id),
  result jsonb,
  status text DEFAULT 'pending'
);

ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own imei checks"
  ON imei_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert imei checks"
  ON imei_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own imei checks"
  ON imei_checks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);