/*
  # Add RLS policies for repair messages

  1. Changes
    - Enable RLS on repair_messages table
    - Add policies for:
      - Public access to view messages
      - Authenticated users can send messages
      - Messages are linked to repairs

  2. Security
    - Allow public access to repair messages
    - Ensure proper message management
*/

-- Enable RLS on repair_messages table
ALTER TABLE repair_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable public repair messages view" ON repair_messages;
DROP POLICY IF EXISTS "Enable authenticated messages" ON repair_messages;

-- Create policies for repair messages
CREATE POLICY "Enable public repair messages view"
ON repair_messages
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable authenticated messages"
ON repair_messages
FOR INSERT
TO authenticated
WITH CHECK (true);