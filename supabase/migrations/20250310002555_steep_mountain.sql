/*
  # Correction du schéma des réparations

  1. Modifications
    - Ajout des contraintes de clés étrangères manquantes
    - Ajout des index pour améliorer les performances
    - Mise à jour des politiques de sécurité
    - Ajout de triggers pour la gestion du stock

  2. Tables concernées
    - repairs
    - repair_parts
    - devices
    - inventory
    - customers

  3. Sécurité
    - Mise à jour des politiques RLS
    - Ajout de politiques pour les techniciens
*/

-- Vérification et correction des contraintes de clés étrangères
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'repairs_device_id_fkey'
  ) THEN
    ALTER TABLE repairs
    ADD CONSTRAINT repairs_device_id_fkey
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'repairs_technician_id_fkey'
  ) THEN
    ALTER TABLE repairs
    ADD CONSTRAINT repairs_technician_id_fkey
    FOREIGN KEY (technician_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ajout des index manquants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_repairs_status'
  ) THEN
    CREATE INDEX idx_repairs_status ON repairs(status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_repairs_created_at'
  ) THEN
    CREATE INDEX idx_repairs_created_at ON repairs(created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_repair_parts_repair_id'
  ) THEN
    CREATE INDEX idx_repair_parts_repair_id ON repair_parts(repair_id);
  END IF;
END $$;

-- Mise à jour des politiques de sécurité pour les réparations
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own repairs" ON repairs;
CREATE POLICY "Users can view their own repairs" ON repairs
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = technician_id OR
    EXISTS (
      SELECT 1 FROM devices d
      JOIN customers c ON d.customer_id = c.id
      WHERE d.id = repairs.device_id AND
      (
        -- L'utilisateur est un technicien ou un admin
        EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_id = auth.uid() AND role IN ('admin', 'technician')
        )
      )
    )
  );

DROP POLICY IF EXISTS "Technicians can insert repairs" ON repairs;
CREATE POLICY "Technicians can insert repairs" ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

DROP POLICY IF EXISTS "Technicians can update repairs" ON repairs;
CREATE POLICY "Technicians can update repairs" ON repairs
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = technician_id OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'technician')
    )
  )
  WITH CHECK (
    auth.uid() = technician_id OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

-- Mise à jour des politiques pour les pièces de réparation
ALTER TABLE repair_parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Technicians can manage repair parts" ON repair_parts;
CREATE POLICY "Technicians can manage repair parts" ON repair_parts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'technician')
    )
  );

-- Fonction pour gérer le stock lors de l'ajout/suppression de pièces
CREATE OR REPLACE FUNCTION handle_repair_part_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Vérifier et mettre à jour le stock lors de l'ajout
    UPDATE inventory
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.inventory_id AND quantity >= NEW.quantity;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock insuffisant';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Restaurer le stock lors de la suppression
    UPDATE inventory
    SET quantity = quantity + OLD.quantity
    WHERE id = OLD.inventory_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour la gestion automatique du stock
DROP TRIGGER IF EXISTS repair_part_stock_trigger ON repair_parts;
CREATE TRIGGER repair_part_stock_trigger
  AFTER INSERT OR DELETE ON repair_parts
  FOR EACH ROW
  EXECUTE FUNCTION handle_repair_part_stock();

-- Fonction pour vérifier l'existence d'un appareil
CREATE OR REPLACE FUNCTION check_device_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM devices WHERE id = NEW.device_id
  ) THEN
    RAISE EXCEPTION 'Appareil non trouvé';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier l'existence de l'appareil avant l'insertion d'une réparation
DROP TRIGGER IF EXISTS check_device_trigger ON repairs;
CREATE TRIGGER check_device_trigger
  BEFORE INSERT ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION check_device_exists();