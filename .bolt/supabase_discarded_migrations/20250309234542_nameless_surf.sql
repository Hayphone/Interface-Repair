/*
  # Add RLS policies for inventory management

  1. Security Changes
    - Enable RLS on inventory table if not already enabled
    - Add policies for:
      - All authenticated users can view inventory items
      - All authenticated users can insert new items
      - All authenticated users can update inventory quantities
      - Only admins can delete inventory items

  2. Notes
    - Uses DO blocks to check for existing policies before creating
    - Ensures idempotent execution
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'inventory' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add policies if they don't exist
DO $$ 
BEGIN
  -- View policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'inventory' 
    AND policyname = 'Enable read access to inventory'
  ) THEN
    CREATE POLICY "Enable read access to inventory"
      ON inventory
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'inventory' 
    AND policyname = 'Users can add inventory items'
  ) THEN
    CREATE POLICY "Users can add inventory items"
      ON inventory
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'inventory' 
    AND policyname = 'Users can update inventory'
  ) THEN
    CREATE POLICY "Users can update inventory"
      ON inventory
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'inventory' 
    AND policyname = 'Admins can delete inventory'
  ) THEN
    CREATE POLICY "Admins can delete inventory"
      ON inventory
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.role = 'admin'
        )
      );
  END IF;
END $$;