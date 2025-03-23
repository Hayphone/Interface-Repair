import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

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
};

export const REPAIR_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived'
} as const;

export const REPAIR_STATUS_LABELS = {
  [REPAIR_STATUS.PENDING]: 'Pris en charge',
  [REPAIR_STATUS.IN_PROGRESS]: 'Intervention en cours',
  [REPAIR_STATUS.COMPLETED]: 'Terminé : En attente de collecte',
  [REPAIR_STATUS.DELIVERED]: 'Rendu',
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

interface RepairState {
  repairs: Repair[];
  archivedRepairs: Repair[];
  loading: boolean;
  error: string | null;
  fetchRepairs: () => Promise<void>;
  fetchArchivedRepairs: () => Promise<void>;
  getRepair: (id: string) => Promise<Repair | null>;
  addRepair: (repair: Omit<Repair, 'id' | 'created_at' | 'technician_id'>) => Promise<void>;
  updateRepairStatus: (id: string, status: string) => Promise<void>;
  cancelRepair: (id: string, reason?: string) => Promise<void>;
  archiveRepair: (id: string) => Promise<void>;
  unarchiveRepair: (id: string) => Promise<void>;
  addRepairPart: (repairId: string, inventoryId: string, quantity: number) => Promise<void>;
  removeRepairPart: (repairId: string, partId: string) => Promise<void>;
  updateRepairDescription: (id: string, description: string) => Promise<void>;
  updateRepairCost: (id: string, estimatedCost: number) => Promise<void>;
  completeRepair: (id: string, completionDetails: { notes?: string }) => Promise<void>;
  deleteRepair: (id: string) => Promise<void>;
  uploadMedia: (repairId: string, file: File) => Promise<void>;
  deleteMedia: (repairId: string, mediaId: string) => Promise<void>;
  sendMessage: (repairId: string, content: string, sender: 'client' | 'technician') => Promise<void>;
}

export const useRepairStore = create<RepairState>((set, get) => ({
  repairs: [],
  archivedRepairs: [],
  loading: false,
  error: null,

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

  addRepair: async (repairData) => {
    set({ loading: true, error: null });
    try {
      const { data: device, error: deviceError } = await supabase
        .from('devices')
        .select('id')
        .eq('id', repairData.device_id)
        .single();

      if (deviceError || !device) {
        throw new Error('Appareil non trouvé');
      }

      const { data: repair, error: repairError } = await supabase
        .from('repairs')
        .insert({
          device_id: repairData.device_id,
          technician_id: '00000000-0000-0000-0000-000000000000',
          description: repairData.description,
          estimated_cost: repairData.estimated_cost,
          status: REPAIR_STATUS.PENDING
        })
        .select()
        .single();

      if (repairError) throw repairError;

      await get().fetchRepairs();
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
        .update({ 
          status,
          completed_at: status === REPAIR_STATUS.COMPLETED ? new Date().toISOString() : null,
          archived_at: status === REPAIR_STATUS.DELIVERED ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      await Promise.all([
        get().fetchRepairs(),
        get().fetchArchivedRepairs()
      ]);
    } catch (error) {
      console.error('Error updating repair status:', error);
      set({ error: 'Erreur lors de la mise à jour du statut' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelRepair: async (id: string, reason?: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({
          status: REPAIR_STATUS.CANCELLED,
          cancel_reason: reason,
          description: reason ? `ANNULÉ - Raison: ${reason}` : 'ANNULÉ'
        })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error cancelling repair:', error);
      set({ error: 'Erreur lors de l\'annulation de la réparation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  archiveRepair: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({
          status: REPAIR_STATUS.ARCHIVED,
          archived_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await Promise.all([
        get().fetchRepairs(),
        get().fetchArchivedRepairs()
      ]);
    } catch (error) {
      console.error('Error archiving repair:', error);
      set({ error: 'Erreur lors de l\'archivage de la réparation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  unarchiveRepair: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({
          status: REPAIR_STATUS.PENDING,
          archived_at: null
        })
        .eq('id', id);

      if (error) throw error;
      await Promise.all([
        get().fetchRepairs(),
        get().fetchArchivedRepairs()
      ]);
    } catch (error) {
      console.error('Error unarchiving repair:', error);
      set({ error: 'Erreur lors de la restauration de la réparation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addRepairPart: async (repairId: string, inventoryId: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('id', inventoryId)
        .single();

      if (inventoryError || !inventory) {
        throw new Error('Pièce non trouvée');
      }

      if (inventory.quantity < quantity) {
        throw new Error('Stock insuffisant');
      }

      const { error: partError } = await supabase
        .from('repair_parts')
        .insert({
          repair_id: repairId,
          inventory_id: inventoryId,
          quantity
        });

      if (partError) throw partError;

      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: inventory.quantity - quantity })
        .eq('id', inventoryId);

      if (updateError) throw updateError;

      await get().fetchRepairs();
    } catch (error) {
      console.error('Error adding repair part:', error);
      set({ error: 'Erreur lors de l\'ajout de la pièce' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeRepairPart: async (repairId: string, partId: string) => {
    set({ loading: true, error: null });
    try {
      const { data: part, error: partError } = await supabase
        .from('repair_parts')
        .select('quantity, inventory_id')
        .eq('id', partId)
        .single();

      if (partError || !part) {
        throw new Error('Pièce non trouvée');
      }

      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          quantity: supabase.rpc('increment', { value: part.quantity })
        })
        .eq('id', part.inventory_id);

      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from('repair_parts')
        .delete()
        .eq('id', partId);

      if (deleteError) throw deleteError;

      await get().fetchRepairs();
    } catch (error) {
      console.error('Error removing repair part:', error);
      set({ error: 'Erreur lors de la suppression de la pièce' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRepairDescription: async (id: string, description: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ description })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error updating repair description:', error);
      set({ error: 'Erreur lors de la mise à jour de la description' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRepairCost: async (id: string, estimatedCost: number) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ estimated_cost: estimatedCost })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error updating repair cost:', error);
      set({ error: 'Erreur lors de la mise à jour du coût' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  completeRepair: async (id: string, completionDetails: { notes?: string }) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repairs')
        .update({
          status: REPAIR_STATUS.COMPLETED,
          completed_at: new Date().toISOString(),
          description: supabase.rpc('append_notes', {
            current_description: supabase.raw('description'),
            new_notes: completionDetails.notes
          })
        })
        .eq('id', id);

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error completing repair:', error);
      set({ error: 'Erreur lors de la finalisation de la réparation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRepair: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // 1. Récupérer les pièces associées à la réparation
      const { data: parts, error: partsError } = await supabase
        .from('repair_parts')
        .select('quantity, inventory_id')
        .eq('repair_id', id);

      if (partsError) throw partsError;

      // 2. Restaurer le stock pour chaque pièce
      for (const part of (parts || [])) {
        const { error: updateError } = await supabase
          .from('inventory')
          .update({
            quantity: supabase.rpc('increment', { value: part.quantity })
          })
          .eq('id', part.inventory_id);

        if (updateError) throw updateError;
      }

      // 3. Supprimer les pièces de réparation
      const { error: deletePartsError } = await supabase
        .from('repair_parts')
        .delete()
        .eq('repair_id', id);

      if (deletePartsError) throw deletePartsError;

      // 4. Supprimer la réparation
      const { error: deleteRepairError } = await supabase
        .from('repairs')
        .delete()
        .eq('id', id);

      if (deleteRepairError) throw deleteRepairError;

      await get().fetchRepairs();
    } catch (error) {
      console.error('Error deleting repair:', error);
      set({ error: 'Erreur lors de la suppression de la réparation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  uploadMedia: async (repairId: string, file: File) => {
    set({ loading: true, error: null });
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${repairId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('repair-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('repair-media')
        .getPublicUrl(filePath);

      // Add media record to database
      const { error: dbError } = await supabase
        .from('repair_media')
        .insert({
          repair_id: repairId,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });

      if (dbError) throw dbError;

      await get().fetchRepairs();
    } catch (error) {
      console.error('Error uploading media:', error);
      set({ error: 'Erreur lors de l\'upload du média' });
    } finally {
      set({ loading: false });
    }
  },

  deleteMedia: async (repairId: string, mediaId: string) => {
    set({ loading: true, error: null });
    try {
      // Get media record
      const { data: media, error: fetchError } = await supabase
        .from('repair_media')
        .select('url')
        .eq('id', mediaId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const filePath = media.url.split('/').pop();
      const { error: storageError } = await supabase.storage
        .from('repair-media')
        .remove([`${repairId}/${filePath}`]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('repair_media')
        .delete()
        .eq('id', mediaId);

      if (dbError) throw dbError;

      await get().fetchRepairs();
    } catch (error) {
      console.error('Error deleting media:', error);
      set({ error: 'Erreur lors de la suppression du média' });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (repairId: string, content: string, sender: 'client' | 'technician') => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('repair_messages')
        .insert({
          repair_id: repairId,
          content,
          sender
        });

      if (error) throw error;
      await get().fetchRepairs();
    } catch (error) {
      console.error('Error sending message:', error);
      set({ error: 'Erreur lors de l\'envoi du message' });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));