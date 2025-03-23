import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Repair = Database['public']['Tables']['repairs']['Row'] & {
  devices: Database['public']['Tables']['devices']['Row'];
  customers: Database['public']['Tables']['customers']['Row'];
};

interface DashboardMetrics {
  activeRepairs: number;
  completedRepairs: number;
  totalInventoryItems: number;
  activeCustomers: number;
}

interface DashboardState {
  metrics: DashboardMetrics;
  recentRepairs: Repair[];
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {
    activeRepairs: 0,
    completedRepairs: 0,
    totalInventoryItems: 0,
    activeCustomers: 0,
  },
  recentRepairs: [],
  loading: false,
  error: null,
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch active repairs count
      const { count: activeRepairs } = await supabase
        .from('repairs')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_progress']);

      // Fetch completed repairs count
      const { count: completedRepairs } = await supabase
        .from('repairs')
        .select('*', { count: 'exact', head: true })
        .in('status', ['completed', 'delivered']);

      // Fetch total inventory items
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('quantity');
      
      const totalInventoryItems = inventoryData?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

      // Fetch active customers count (customers with repairs in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Fetch recent repairs with related data
      const { data: recentRepairs, error: repairsError } = await supabase
        .from('repairs')
        .select(`
          *,
          devices (*),
          customers:devices(customers(*))
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (repairsError) throw repairsError;

      set({
        metrics: {
          activeRepairs: activeRepairs || 0,
          completedRepairs: completedRepairs || 0,
          totalInventoryItems,
          activeCustomers: activeCustomers || 0,
        },
        recentRepairs: recentRepairs || [],
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));