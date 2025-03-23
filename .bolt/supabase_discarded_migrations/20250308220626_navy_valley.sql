/*
  # Add user roles and policies

  1. New Tables
    - `user_roles`
      - `user_id` (uuid, references auth.users)
      - `role` (text, either 'admin' or 'user')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_roles` table
    - Add policies for role-based access
    - Update existing table policies for role-based access
    - Add admin check function

  3. Changes
    - Drop existing policies if they exist
    - Create new role-based policies for all tables
    - Add function to check admin status
*/

-- Create user_roles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    CREATE TABLE user_roles (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
      created_at TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read all customers" ON customers;
DROP POLICY IF EXISTS "Users can read all devices" ON devices;
DROP POLICY IF EXISTS "Users can read all repairs" ON repairs;
DROP POLICY IF EXISTS "Users can read all inventory" ON inventory;
DROP POLICY IF EXISTS "Role-based customer access" ON customers;
DROP POLICY IF EXISTS "Role-based device access" ON devices;
DROP POLICY IF EXISTS "Role-based repair access" ON repairs;
DROP POLICY IF EXISTS "Role-based inventory access" ON inventory;
DROP POLICY IF EXISTS "Admin inventory management" ON inventory;

-- Create new policies
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Update existing table policies to be role-aware
CREATE POLICY "Role-based customer access"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND (role = 'admin' OR role = 'user')
    )
  );

CREATE POLICY "Role-based device access"
  ON devices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND (role = 'admin' OR role = 'user')
    )
  );

CREATE POLICY "Role-based repair access"
  ON repairs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND (role = 'admin' OR role = 'user')
    )
  );

CREATE POLICY "Role-based inventory access"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND (role = 'admin' OR role = 'user')
    )
  );

CREATE POLICY "Admin inventory management"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;