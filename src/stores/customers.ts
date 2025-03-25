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
  getCustomerOptions: () => Array<{ id: string; label: string; }>;
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

  getCustomerOptions: () => {
    return get().customers.map(customer => ({
      id: customer.id,
      label: `${customer.name}${customer.phone ? ` - ${customer.phone}` : ''}`
    }));
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
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;
      await get().fetchCustomers();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));