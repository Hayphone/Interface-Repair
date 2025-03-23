/*
  # Update repairs table and RLS policies

  1. Changes
    - Add default value for technician_id
    - Enable RLS on repairs table
    - Add policies for CRUD operations

  2. Security
    - Enable RLS on repairs table
    - Add policies for:
      - Insert: Authenticated users can create repairs
      - Select: Authenticated users can view all repairs
      - Update: Authenticated users can update repairs
      - Delete: Authenticated users can delete repairs

  3. Notes
    - Default technician_id is set to avoid foreign key constraint issues
    - All authenticated users have full access to repairs
*/

-- Update repairs table to set default technician_id
ALTER TABLE repairs 
ALTER COLUMN technician_id SET DEFAULT '00000000-0000-0000-0000-000000000000';

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Policy for inserting repairs
CREATE POLICY "Enable insert access for authenticated users"
  ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for selecting repairs
CREATE POLICY "Enable read access for authenticated users"
  ON repairs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for updating repairs
CREATE POLICY "Enable update access for authenticated users"
  ON repairs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for deleting repairs
CREATE POLICY "Enable delete access for authenticated users"
  ON repairs
  FOR DELETE
  TO authenticated
  USING (true);