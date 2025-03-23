import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Inventory = Database['public']['Tables']['inventory']['Row'];

interface InventoryState {
  inventory: Inventory[];
  loading: boolean;
  error: string | null;
  fetchInventory: () => Promise<void>;
  addInventoryItem: (item: Omit<Inventory, 'id' | 'created_at'>) => Promise<Inventory | null>;
  updateInventoryQuantity: (id: string, quantity: number) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [],
  loading: false,
  error: null,
  fetchInventory: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ inventory: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  addInventoryItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const { data: item, error } = await supabase
        .from('inventory')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;

      await get().fetchInventory();
      return item;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  updateInventoryQuantity: async (id: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;
      await get().fetchInventory();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));