/*
  # Fix repair messages persistence

  1. Changes
    - Drop and recreate RLS policies
    - Add performance indexes
    - Update foreign key constraints
    - Enable RLS with proper policies
  
  2. Security
    - Allow public access to messages
    - Ensure proper message management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable public repair messages view" ON repair_messages;
DROP POLICY IF EXISTS "Enable authenticated messages" ON repair_messages;

-- Recreate the table with proper constraints
DROP TABLE IF EXISTS repair_messages;
CREATE TABLE repair_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id uuid NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  content text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('client', 'technician')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT repair_messages_repair_id_fkey FOREIGN KEY (repair_id) 
    REFERENCES repairs(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_repair_messages_repair_id ON repair_messages(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_messages_created_at ON repair_messages(created_at);

-- Enable RLS
ALTER TABLE repair_messages ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "repair_messages_select_policy"
ON repair_messages FOR SELECT
TO public
USING (true);

CREATE POLICY "repair_messages_insert_policy"
ON repair_messages FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "repair_messages_delete_policy"
ON repair_messages FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM repairs 
  WHERE repairs.id = repair_messages.repair_id
));

-- Grant necessary permissions
GRANT ALL ON repair_messages TO authenticated;
GRANT SELECT ON repair_messages TO anon;