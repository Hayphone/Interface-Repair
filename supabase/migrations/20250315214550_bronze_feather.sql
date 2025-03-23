/*
  # Update repair status management

  1. Changes
    - Add new status values
    - Add archived_at column
    - Add cancel_reason column
    - Update existing data

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
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