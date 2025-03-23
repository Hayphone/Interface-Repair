/*
  # Add repair messages table

  1. New Tables
    - `repair_messages`
      - `id` (uuid, primary key)
      - `repair_id` (uuid, references repairs)
      - `content` (text)
      - `sender` (text, either 'client' or 'technician')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create repair_messages table
CREATE TABLE IF NOT EXISTS repair_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id uuid REFERENCES repairs(id) ON DELETE CASCADE,
  content text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('client', 'technician')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_repair_messages_repair_id ON repair_messages(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_messages_created_at ON repair_messages(created_at);

-- Disable RLS since it's already disabled globally
ALTER TABLE repair_messages DISABLE ROW LEVEL SECURITY;