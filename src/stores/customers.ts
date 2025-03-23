import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];
type Device = Database['public']['Tables']['devices']['Row'];

interface CustomerState {
  customers: (Customer & { devices: Device[] })[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>, devices: Array<Omit<Device, 'id' | 'created_at' | 'customer_id'>>) => Promise<Customer | null>;
  addDevice: (customerId: string, device: Omit<Device, 'id' | 'created_at' | 'customer_id'>) => Promise<Device | null>;
  deleteCustomer: (customerId: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, devices(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ customers: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addCustomer: async (customerData, devices) => {
    set({ loading: true, error: null });
    try {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();

      if (customerError) throw customerError;

      if (devices.length > 0) {
        const devicesWithCustomerId = devices.map(device => ({
          ...device,
          customer_id: customer.id
        }));

        const { error: devicesError } = await supabase
          .from('devices')
          .insert(devicesWithCustomerId);

        if (devicesError) throw devicesError;
      }

      await get().fetchCustomers();
      return customer;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addDevice: async (customerId, deviceData) => {
    set({ loading: true, error: null });
    try {
      const { data: device, error } = await supabase
        .from('devices')
        .insert({ ...deviceData, customer_id: customerId })
        .select()
        .single();

      if (error) throw error;

      await get().fetchCustomers();
      return device;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  deleteCustomer: async (customerId: string) => {
    set({ loading: true, error: null });
    try {
      // 1. Récupérer tous les appareils du client
      const { data: devices, error: devicesError } = await supabase
        .from('devices')
        .select('id')
        .eq('customer_id', customerId);

      if (devicesError) throw devicesError;

      // 2. Pour chaque appareil, supprimer les réparations associées
      for (const device of (devices || [])) {
        // 2.1 Récupérer les réparations de l'appareil
        const { data: repairs, error: repairsError } = await supabase
          .from('repairs')
          .select('id')
          .eq('device_id', device.id);

        if (repairsError) throw repairsError;

        // 2.2 Pour chaque réparation, supprimer les pièces associées
        for (const repair of (repairs || [])) {
          const { error: partsError } = await supabase
            .from('repair_parts')
            .delete()
            .eq('repair_id', repair.id);

          if (partsError) throw partsError;
        }

        // 2.3 Supprimer les réparations
        const { error: deleteRepairsError } = await supabase
          .from('repairs')
          .delete()
          .eq('device_id', device.id);

        if (deleteRepairsError) throw deleteRepairsError;
      }

      // 3. Supprimer les appareils
      const { error: deleteDevicesError } = await supabase
        .from('devices')
        .delete()
        .eq('customer_id', customerId);

      if (deleteDevicesError) throw deleteDevicesError;

      // 4. Supprimer le client
      const { error: deleteCustomerError } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (deleteCustomerError) throw deleteCustomerError;

      await get().fetchCustomers();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));