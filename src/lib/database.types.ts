export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          status?: string | null
        }
      }
      devices: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          brand: string
          model: string
          serial_number: string | null
          condition: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          brand: string
          model: string
          serial_number?: string | null
          condition?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          brand?: string
          model?: string
          serial_number?: string | null
          condition?: string | null
        }
      }
      repairs: {
        Row: {
          id: string
          created_at: string
          device_id: string
          technician_id: string
          status: string
          description: string | null
          estimated_cost: number | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          device_id: string
          technician_id: string
          status?: string
          description?: string | null
          estimated_cost?: number | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          device_id?: string
          technician_id?: string
          status?: string
          description?: string | null
          estimated_cost?: number | null
          completed_at?: string | null
        }
      }
      inventory: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          quantity: number
          price: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          quantity?: number
          price?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          quantity?: number
          price?: number | null
        }
      }
      repair_parts: {
        Row: {
          id: string
          created_at: string
          repair_id: string
          inventory_id: string
          quantity: number
        }
        Insert: {
          id?: string
          created_at?: string
          repair_id: string
          inventory_id: string
          quantity?: number
        }
        Update: {
          id?: string
          created_at?: string
          repair_id?: string
          inventory_id?: string
          quantity?: number
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: string
          created_at?: string
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
}