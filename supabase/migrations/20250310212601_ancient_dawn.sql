/*
  # Add RLS policies for repairs table

  1. Security Changes
    - Enable RLS on repairs table
    - Add policies for:
      - Insert: Authenticated users can create repairs
      - Select: Authenticated users can view all repairs
      - Update: Authenticated users can update repairs
      - Delete: Authenticated users can delete repairs

  2. Notes
    - All authenticated users have full access to repairs
    - This matches the application's current functionality where any logged-in user can manage repairs
*/

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Policy for inserting repairs
CREATE POLICY "Users can create repairs"
  ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for viewing repairs
CREATE POLICY "Users can view all repairs"
  ON repairs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for updating repairs
CREATE POLICY "Users can update repairs"
  ON repairs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for deleting repairs
CREATE POLICY "Users can delete repairs"
  ON repairs
  FOR DELETE
  TO authenticated
  USING (true);