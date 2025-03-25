import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { DiagnosticData } from '../components/DiagnosticForm';

export const REPAIR_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived'
} as const;

export const REPAIR_STATUS_LABELS = {
  [REPAIR_STATUS.PENDING]: 'En attente',
  [REPAIR_STATUS.IN_PROGRESS]: 'En cours',
  [REPAIR_STATUS.COMPLETED]: 'Terminé',
  [REPAIR_STATUS.DELIVERED]: 'Livré',
  [REPAIR_STATUS.CANCELLED]: 'Annulé',
  [REPAIR_STATUS.ARCHIVED]: 'Archivé'
} as const;

export const REPAIR_STATUS_COLORS = {
  [REPAIR_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [REPAIR_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [REPAIR_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [REPAIR_STATUS.DELIVERED]: 'bg-purple-100 text-purple-800',
  [REPAIR_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [REPAIR_STATUS.ARCHIVED]: 'bg-gray-100 text-gray-800'
} as const;

type Repair = Database['public']['Tables']['repairs']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] & {
    customers?: Database['public']['Tables']['customers']['Row'][];
  };
  repair_parts?: Array<{
    id: string;
    quantity: number;
    inventory: Database['public']['Tables']['inventory']['Row'];
  }>;
  repair_media?: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    created_at: string;
  }>;
  repair_messages?: Array<{
    id: string;
    content: string;
    sender: 'client' | 'technician';
    created_at: string;
  }>;
  diagnostics?: DiagnosticData;
};

interface RepairState {
  repairs: Repair[];
  archivedRepairs: Repair[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fetchRepairs: () => Promise<void>;
  fetchArchivedRepairs: () => Promise<void>;
  getRepair: (id: string) => Promise<Repair | null>;
  addRepair: (data: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
    };
    device: {
      brand: string;
      model: string;
      serial_number?: string;
    };
    diagnostics?: DiagnosticData;
    description: string;
    estimated_cost: number;
  }) => Promise<string>;
  updateRepairStatus: (id: string, status: string) => Promise<void>;
  updateRepairDiagnostics: (id: string, diagnostics: DiagnosticData) => Promise<void>;
  deleteRepair: (id: string) => Promise<void>;
  clearMessages: () => void;
}

export const useRepairStore = create<RepairState>((set, get) => ({
  repairs: [],
  archivedRepairs: [],
  loading: false,
  error: null,
  successMessage: null,

  clearMessages: () => {
    set({ error: null, successMessage: null });
  },

  fetchRepairs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          *,
          devices (
            *,
            customers (*)
          ),
          repair_parts (
            *,
            inventory (*)
          ),
          repair_media (*),
          repair_messages (*)
        `)
        .not('status', 'eq', REPAIR_STATUS.ARCHIVED)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ repairs: data || [] });
    } catch (error) {
      console.error('Error fetching repairs:', error);
      set({ error: 'Erreur lors du chargement des réparations' });
    } finally {
      set({ loading: false });
    }
  },

  fetchArchivedRepairs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          *,
          devices (
            *,
            customers (*)
          ),
          repair_parts (
            *,
            inventory (*)
          ),
          repair_media (*),
          repair_messages (*)
        `)
        .eq('status', REPAIR_STATUS.ARCHIVED)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ archivedRepairs: data || [] });
    } catch (error) {
      console.error('Error fetching archived repairs:', error);
      set({ error: 'Erreur lors du chargement des réparations archivées' });
    } finally {
      set({ loading: false });
    }
  },

  getRepair: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          *,
          devices (
            *,
            customers (*)
          ),
          repair_parts (
            *,
            inventory (*)
          ),
          repair_media (*),
          repair_messages (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching repair:', error);
      return null;
    }
  },

  addRepair: async (data) => {
    set({ loading: true, error: null });
    try {
      // 1. Create or get customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
          address: data.customer.address
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // 2. Create device
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .insert({
          customer_id: customer.id,
          brand: data.device.brand,
          model: data.device.model,
          serial_number: data.device.serial_number
        })
        .select()
        .single();

      if (deviceError) throw deviceError;

      // 3. Create repair with diagnostics
      const { data: repair, error: repairError } = await supabase
        .from('repairs')
        .insert({
          device_id: device.id,
          description: data.description,
          estimated_cost: data.estimated_cost,
          status: REPAIR_STATUS.PENDING,
          technician_id: '00000000-0000-0000-0000-000000000000',
          diagnostics: data.diagnostics || null
        })
        .select()
        .single();

      if (repairError) throw repairError;

      await get().fetchRepairs();
      set({ successMessage: 'Réparation ajoutée avec succès' });
      return repair.id;
    } catch (error) {
      console.error('Error adding repair:', error);
      set({ error: 'Erreur lors de l\'ajout de la réparation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRepairStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error updating repair status:', error);
      set({ error: 'Erreur lors de la mise à jour du statut' });
    } finally {
      set({ loading: false });
    }
  },

  updateRepairDiagnostics: async (id: string, diagnostics: DiagnosticData) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ diagnostics })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
      set({ successMessage: 'Diagnostic mis à jour avec succès' });
    } catch (error) {
      console.error('Error updating repair diagnostics:', error);
      set({ error: 'Erreur lors de la mise à jour du diagnostic' });
    } finally {
      set({ loading: false });
    }
  },

  deleteRepair: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error deleting repair:', error);
      set({ error: 'Erreur lors de la suppression de la réparation' });
    } finally {
      set({ loading: false });
    }
  }
}));