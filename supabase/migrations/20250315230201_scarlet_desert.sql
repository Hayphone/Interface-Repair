/*
  # Configure storage bucket for repair media

  1. Changes
    - Create storage bucket for repair media
    - Set up RLS policies for media access
    - Configure allowed file types and size limits
  
  2. Security
    - Enable authenticated users to manage their media
    - Restrict file types and sizes
    - Ensure proper access control
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('repair-media', 'repair-media', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;

-- Allow authenticated users to upload media
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'repair-media' AND
  (LOWER(RIGHT(name, 4)) IN ('.png', '.jpg', '.gif') OR 
   LOWER(RIGHT(name, 5)) IN ('.jpeg', '.webm') OR 
   LOWER(RIGHT(name, 4)) IN ('.mp4')) AND
  (LENGTH(name) < 255)
);

-- Allow authenticated users to read media
CREATE POLICY "Authenticated users can read media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'repair-media');

-- Allow authenticated users to delete their media
CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'repair-media');

-- Update bucket configuration
UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY[
      'image/png',
      'image/jpeg',
      'image/gif',
      'video/mp4',
      'video/webm'
    ]
WHERE id = 'repair-media';