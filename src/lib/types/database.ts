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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          icon: string | null
          sort_order: number | null
          source_site: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          sort_order?: number | null
          source_site?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          sort_order?: number | null
          source_site?: string | null
          created_at?: string
        }
      }
      indicators: {
        Row: {
          id: string
          name: string
          slug: string
          category_id: string | null
          unit: string | null
          frequency: string | null
          source: string | null
          description: string | null
          source_url: string | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category_id?: string | null
          unit?: string | null
          frequency?: string | null
          source?: string | null
          description?: string | null
          source_url?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category_id?: string | null
          unit?: string | null
          frequency?: string | null
          source?: string | null
          description?: string | null
          source_url?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      indicator_values: {
        Row: {
          id: string
          indicator_id: string
          value: number
          value_date: string
          period: string
          variation: number | null
          source_url: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          indicator_id: string
          value: number
          value_date: string
          period: string
          variation?: number | null
          source_url?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          indicator_id?: string
          value?: number
          value_date?: string
          period?: string
          variation?: number | null
          source_url?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      publications: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category_id: string | null
          publication_date: string | null
          publication_type: string | null
          source: string | null
          original_url: string | null
          local_path: string | null
          file_type: string | null
          file_size: number | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          category_id?: string | null
          publication_date?: string | null
          publication_type?: string | null
          source?: string | null
          original_url?: string | null
          local_path?: string | null
          file_type?: string | null
          file_size?: number | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          publication_date?: string | null
          publication_type?: string | null
          source?: string | null
          original_url?: string | null
          local_path?: string | null
          file_type?: string | null
          file_size?: number | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      datasets: {
        Row: {
          id: string
          name: string
          slug: string
          title: string
          description: string | null
          organization: string | null
          organization_slug: string | null
          category_id: string | null
          source_site: string | null
          source_url: string | null
          frequency: string | null
          date_range_start: string | null
          date_range_end: string | null
          ckan_id: string | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          title: string
          description?: string | null
          organization?: string | null
          organization_slug?: string | null
          category_id?: string | null
          source_site?: string | null
          source_url?: string | null
          frequency?: string | null
          date_range_start?: string | null
          date_range_end?: string | null
          ckan_id?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          title?: string
          description?: string | null
          organization?: string | null
          organization_slug?: string | null
          category_id?: string | null
          source_site?: string | null
          source_url?: string | null
          frequency?: string | null
          date_range_start?: string | null
          date_range_end?: string | null
          ckan_id?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      dataset_resources: {
        Row: {
          id: string
          dataset_id: string
          name: string
          description: string | null
          format: string | null
          original_url: string | null
          local_path: string | null
          file_size: number | null
          downloaded: boolean | null
          extracted: boolean | null
          downloaded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dataset_id: string
          name: string
          description?: string | null
          format?: string | null
          original_url?: string | null
          local_path?: string | null
          file_size?: number | null
          downloaded?: boolean | null
          extracted?: boolean | null
          downloaded_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dataset_id?: string
          name?: string
          description?: string | null
          format?: string | null
          original_url?: string | null
          local_path?: string | null
          file_size?: number | null
          downloaded?: boolean | null
          extracted?: boolean | null
          downloaded_at?: string | null
          created_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          section: string | null
          content: string | null
          html_content: string | null
          url: string | null
          source_site: string | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          section?: string | null
          content?: string | null
          html_content?: string | null
          url?: string | null
          source_site?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          section?: string | null
          content?: string | null
          html_content?: string | null
          url?: string | null
          source_site?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          section: string
          apellido: string
          nombre: string
          funcion: string
          sort_order: number
          email: string | null
          photo_url: string | null
          gender: string | null
          created_at: string
        }
        Insert: {
          id?: string
          section: string
          apellido: string
          nombre: string
          funcion: string
          sort_order?: number
          email?: string | null
          photo_url?: string | null
          gender?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          section?: string
          apellido?: string
          nombre?: string
          funcion?: string
          sort_order?: number
          email?: string | null
          photo_url?: string | null
          gender?: string | null
          created_at?: string
        }
      }
      institutions: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          url: string | null
          institution_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          url?: string | null
          institution_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          url?: string | null
          institution_type?: string | null
          created_at?: string
        }
      }
    }
  }
}