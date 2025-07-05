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
      contacts: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          message: string
          responded: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          message: string
          responded?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          message?: string
          responded?: boolean
        }
      }
      experiences: {
        Row: {
          id: number
          created_at: string
          job_title: string
          company: string
          start_date: string
          end_date: string | null
          description: string
          achievements: string[]
          tools_used: string[]
          current: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          job_title: string
          company: string
          start_date: string
          end_date?: string | null
          description: string
          achievements?: string[]
          tools_used?: string[]
          current?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          job_title?: string
          company?: string
          start_date?: string
          end_date?: string | null
          description?: string
          achievements?: string[]
          tools_used?: string[]
          current?: boolean
        }
      }
      projects: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          technologies: string[]
          image_url: string
          live_url: string | null
          github_url: string | null
          featured: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          technologies?: string[]
          image_url: string
          live_url?: string | null
          github_url?: string | null
          featured?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          technologies?: string[]
          image_url?: string
          live_url?: string | null
          github_url?: string | null
          featured?: boolean
        }
      }
      services: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string
          icon: string
          price: number | null
          featured: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description: string
          icon: string
          price?: number | null
          featured?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string
          icon?: string
          price?: number | null
          featured?: boolean
        }
      }
      testimonials: {
        Row: {
          id: number
          created_at: string
          client_name: string
          client_company: string
          project_type: string
          review: string
          rating: number
          image_url: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          client_name: string
          client_company: string
          project_type: string
          review: string
          rating: number
          image_url?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          client_name?: string
          client_company?: string
          project_type?: string
          review?: string
          rating?: number
          image_url?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}