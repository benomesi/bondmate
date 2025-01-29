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
          name: string
          interests: string[]
          goals: string[]
          communication_style: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          interests?: string[]
          goals?: string[]
          communication_style?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          interests?: string[]
          goals?: string[]
          communication_style?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          interests: string[]
          goals: string[]
          communication_style: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          interests?: string[]
          goals?: string[]
          communication_style?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          interests?: string[]
          goals?: string[]
          communication_style?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          relationship_id: string
          content: string
          is_ai: boolean
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          content: string
          is_ai?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          content?: string
          is_ai?: boolean
          created_at?: string
        }
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
  }
}