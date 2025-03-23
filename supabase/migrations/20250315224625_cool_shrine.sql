/*
  # Add repair media support

  1. New Tables
    - `repair_media`
      - `id` (uuid, primary key)
      - `repair_id` (uuid, references repairs)
      - `url` (text)
      - `type` (text, either 'image' or 'video')
      - `created_at` (timestamp)

  2. Storage
    - Create bucket for repair media

  3. Security
    - Enable RLS on repair_media table
    - Add policies for authenticated users
*/

-- Create repair_media table
CREATE TABLE IF NOT EXISTS repair_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id uuid REFERENCES repairs(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_repair_media_repair_id ON repair_media(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_media_created_at ON repair_media(created_at);

-- Enable RLS
ALTER TABLE repair_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view repair media"
  ON repair_media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert repair media"
  ON repair_media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete repair media"
  ON repair_media FOR DELETE
  TO authenticated
  USING (true);