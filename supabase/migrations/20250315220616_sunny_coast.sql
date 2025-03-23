/*
  # Save repair status changes and archiving functionality

  1. Changes
    - Add archived_at and cancel_reason columns to repairs table
    - Add status check constraint for valid values
    - Add indexes for better performance
    - Update existing status values

  2. Notes
    - Ensures data consistency with new status values
    - Improves query performance with indexes
    - Maintains data integrity with constraints
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'repairs' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE repairs ADD COLUMN archived_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'repairs' AND column_name = 'cancel_reason'
  ) THEN
    ALTER TABLE repairs ADD COLUMN cancel_reason text;
  END IF;
END $$;

-- Update status values for existing repairs
UPDATE repairs
SET status = 'pending'
WHERE status NOT IN ('pending', 'in_progress', 'completed', 'delivered', 'cancelled', 'archived');

-- Add check constraint for status values
ALTER TABLE repairs
DROP CONSTRAINT IF EXISTS repairs_status_check;

ALTER TABLE repairs
ADD CONSTRAINT repairs_status_check
CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered', 'cancelled', 'archived'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);
CREATE INDEX IF NOT EXISTS idx_repairs_archived_at ON repairs(archived_at);
CREATE INDEX IF NOT EXISTS idx_repairs_completed_at ON repairs(completed_at);
CREATE INDEX IF NOT EXISTS idx_repairs_created_at ON repairs(created_at DESC);