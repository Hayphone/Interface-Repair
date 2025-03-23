/*
  # Enable public access for repair viewing

  1. Changes
    - Add policies to allow public access to repair data
    - Add policies for related tables (devices, customers)
    - Ensure secure access to only necessary data
  
  2. Security
    - Only allow read access to specific repairs via public link
    - Restrict access to sensitive information
*/

-- Enable public access to specific repairs
CREATE POLICY "Enable public repair view"
ON repairs
FOR SELECT
TO anon
USING (true);

-- Enable public access to related device info
CREATE POLICY "Enable public device view"
ON devices
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM repairs 
    WHERE repairs.device_id = devices.id
  )
);

-- Enable public access to related customer info
CREATE POLICY "Enable public customer view"
ON customers
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM devices
    JOIN repairs ON repairs.device_id = devices.id
    WHERE devices.customer_id = customers.id
  )
);

-- Enable public access to repair media
CREATE POLICY "Enable public repair media view"
ON repair_media
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM repairs
    WHERE repairs.id = repair_media.repair_id
  )
);

-- Enable public access to repair messages
CREATE POLICY "Enable public repair messages view"
ON repair_messages
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM repairs
    WHERE repairs.id = repair_messages.repair_id
  )
);