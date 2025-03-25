/*
  # Add diagnostics column to repairs table

  1. Changes
    - Add diagnostics JSONB column to repairs table
    - Add index for better performance
    - Update existing rows with NULL value

  2. Notes
    - Uses JSONB for flexible diagnostic data storage
    - Maintains backwards compatibility
*/

-- Add diagnostics column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'repairs' AND column_name = 'diagnostics'
  ) THEN
    ALTER TABLE repairs ADD COLUMN diagnostics JSONB;
    
    -- Create an index for the diagnostics column
    CREATE INDEX idx_repairs_diagnostics ON repairs USING gin(diagnostics);
  END IF;
END $$;