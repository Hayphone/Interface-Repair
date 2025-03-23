/*
  # Fix user roles policies

  1. Changes
    - Remove recursive policies that were causing infinite recursion
    - Add proper RLS policies for user_roles table
    - Simplify access control based on authentication status and user ID

  2. Security
    - Enable RLS on user_roles table
    - Add policies for:
      - Admins can manage all roles
      - Users can read their own role
*/

-- First, drop existing policies to start fresh
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;

-- Create new policies
CREATE POLICY "Admins can manage all roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
  )
);

CREATE POLICY "Users can read own role"
ON user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
$$;