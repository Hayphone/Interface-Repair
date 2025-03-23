/*
  # Update RLS policies for all tables

  1. Changes
    - Remove existing RLS policies
    - Add new public access policies for all tables
    - Keep basic security with RLS enabled but allow all operations

  2. Security
    - Enable RLS on all tables
    - Add permissive policies for all operations
    - This is temporary until authentication is re-implemented
*/

-- Customers table policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Role-based customer access" ON customers;
DROP POLICY IF EXISTS "Users can insert customers" ON customers;

CREATE POLICY "Public customer access"
ON customers
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Devices table policies
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Role-based device access" ON devices;
DROP POLICY IF EXISTS "Users can insert devices" ON devices;

CREATE POLICY "Public device access"
ON devices
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Repairs table policies
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Role-based repair access" ON repairs;
DROP POLICY IF EXISTS "Users can insert repairs" ON repairs;

CREATE POLICY "Public repair access"
ON repairs
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Inventory table policies
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin inventory management" ON inventory;
DROP POLICY IF EXISTS "Role-based inventory access" ON inventory;
DROP POLICY IF EXISTS "Users can insert inventory" ON inventory;

CREATE POLICY "Public inventory access"
ON inventory
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Repair parts table policies
ALTER TABLE repair_parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert repair_parts" ON repair_parts;
DROP POLICY IF EXISTS "Users can read all repair_parts" ON repair_parts;

CREATE POLICY "Public repair_parts access"
ON repair_parts
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- User roles table policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;

CREATE POLICY "Public user_roles access"
ON user_roles
FOR ALL
TO public
USING (true)
WITH CHECK (true);