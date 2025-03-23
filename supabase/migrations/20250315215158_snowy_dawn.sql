/*
  # Fix repair status and archiving

  1. Changes
    - Add archived_at column
    - Add cancel_reason column
    - Update status constraints
    - Add indexes for better performance

  2. Notes
    - Ensures proper tracking of archived and delivered repairs
    - Maintains history of repair status changes
*/

-- Add new columns if they don't exist
ALTER TABLE repairs
ADD COLUMN IF NOT EXISTS archived_at timestamptz,
ADD COLUMN IF NOT EXISTS cancel_reason text;

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