/*
  # Update Authentication and Authorization Settings

  1. Changes
    - Add default role for new users
    - Enable RLS on all tables
    - Add comprehensive RLS policies
    - Create auth helper functions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up role-based access control
    - Add helper functions for auth checks

  3. Notes
    - All tables will have RLS enabled
    - Policies are role-aware where needed
    - Helper functions added for auth checks
*/

-- Create auth helper functions
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT role FROM user_roles WHERE user_id = auth.uid();
$$;

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE imei_checks ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Users can view all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete customers"
  ON customers
  FOR DELETE
  TO authenticated
  USING (true);

-- Devices policies
CREATE POLICY "Users can view all devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update devices"
  ON devices
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete devices"
  ON devices
  FOR DELETE
  TO authenticated
  USING (true);

-- Repairs policies
CREATE POLICY "Users can view all repairs"
  ON repairs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create repairs"
  ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update repairs"
  ON repairs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete repairs"
  ON repairs
  FOR DELETE
  TO authenticated
  USING (true);

-- Inventory policies
CREATE POLICY "Users can view all inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create inventory items"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin'));

CREATE POLICY "Users can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete inventory items"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin'));

-- Repair parts policies
CREATE POLICY "Users can view all repair parts"
  ON repair_parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create repair parts"
  ON repair_parts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update repair parts"
  ON repair_parts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete repair parts"
  ON repair_parts
  FOR DELETE
  TO authenticated
  USING (true);

-- IMEI checks policies
CREATE POLICY "Users can view own IMEI checks"
  ON imei_checks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create IMEI checks"
  ON imei_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update own IMEI checks"
  ON imei_checks
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User roles policies
CREATE POLICY "Users can view own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

-- Trigger to automatically set user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();