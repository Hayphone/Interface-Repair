/*
  # Fix user roles policies and functions

  1. Changes
    - Drop existing policies on user_roles table
    - Create new has_access function
    - Add new policies for user_roles table
    
  2. Security
    - Enable RLS on user_roles table
    - Add policies for admin access
    - Add policies for users to read their own role
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Role-based customer access" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;

-- Create or replace has_access function
CREATE OR REPLACE FUNCTION has_access()
RETURNS boolean AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user is admin
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Admins can manage all roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Users can read own role"
ON user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());