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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          contact_no: string | null
          role: 'donor' | 'recipient' | 'both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          contact_no?: string | null
          role?: 'donor' | 'recipient' | 'both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          contact_no?: string | null
          role?: 'donor' | 'recipient' | 'both'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      food_listings: {
        Row: {
          id: string
          title: string
          description: string
          pickup_time: string
          location: string
          lat: number | null
          lng: number | null
          status: 'available' | 'claimed' | 'completed'
          posted_by: string
          image_url: string | null
          food_type: string | null
          dietary_info: string[] | null
          quantity: string | null
          contact_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          pickup_time: string
          location: string
          lat?: number | null
          lng?: number | null
          status?: 'available' | 'claimed' | 'completed'
          posted_by: string
          image_url?: string | null
          food_type?: string | null
          dietary_info?: string[] | null
          quantity?: string | null
          contact_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          pickup_time?: string
          location?: string
          lat?: number | null
          lng?: number | null
          status?: 'available' | 'claimed' | 'completed'
          posted_by?: string
          image_url?: string | null
          food_type?: string | null
          dietary_info?: string[] | null
          quantity?: string | null
          contact_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_listings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
