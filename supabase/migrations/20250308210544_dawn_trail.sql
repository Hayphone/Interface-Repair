/*
  # Initial Schema Setup for SmartDiscount31

  1. New Tables
    - `customers` - Store customer information
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)

    - `devices` - Store device information
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `customer_id` (uuid, foreign key)
      - `brand` (text)
      - `model` (text)
      - `serial_number` (text)
      - `condition` (text)

    - `repairs` - Track repair tickets
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `device_id` (uuid, foreign key)
      - `technician_id` (uuid, foreign key)
      - `status` (text)
      - `description` (text)
      - `estimated_cost` (numeric)
      - `completed_at` (timestamp)

    - `inventory` - Manage spare parts
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text)
      - `description` (text)
      - `quantity` (integer)
      - `price` (numeric)

    - `repair_parts` - Link repairs to used parts
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `repair_id` (uuid, foreign key)
      - `inventory_id` (uuid, foreign key)
      - `quantity` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text,
  phone text,
  address text
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Devices table
CREATE TABLE devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_id uuid REFERENCES customers(id),
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text,
  condition text
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Repairs table
CREATE TABLE repairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  device_id uuid REFERENCES devices(id),
  technician_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  description text,
  estimated_cost numeric(10,2),
  completed_at timestamptz
);

ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all repairs"
  ON repairs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert repairs"
  ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Inventory table
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  quantity integer NOT NULL DEFAULT 0,
  price numeric(10,2)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Repair parts table
CREATE TABLE repair_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  repair_id uuid REFERENCES repairs(id),
  inventory_id uuid REFERENCES inventory(id),
  quantity integer NOT NULL DEFAULT 1
);

ALTER TABLE repair_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all repair_parts"
  ON repair_parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert repair_parts"
  ON repair_parts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);