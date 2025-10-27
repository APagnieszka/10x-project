export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          data: Json | null
          event_type: string
          household_id: number
          id: number
          timestamp: string
        }
        Insert: {
          data?: Json | null
          event_type: string
          household_id: number
          id?: never
          timestamp?: string
        }
        Update: {
          data?: Json | null
          event_type?: string
          household_id?: number
          id?: never
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_products: {
        Row: {
          barcode: string | null
          brand: string | null
          created_at: string
          expiration_date: string
          household_id: number
          id: number
          main_image_url: string | null
          name: string
          opened: boolean
          opened_date: string | null
          quantity: number
          status: string
          to_buy: boolean
          unit: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          created_at?: string
          expiration_date: string
          household_id: number
          id?: never
          main_image_url?: string | null
          name: string
          opened?: boolean
          opened_date?: string | null
          quantity: number
          status: string
          to_buy?: boolean
          unit: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          created_at?: string
          expiration_date?: string
          household_id?: number
          id?: never
          main_image_url?: string | null
          name?: string
          opened?: boolean
          opened_date?: string | null
          quantity?: number
          status?: string
          to_buy?: boolean
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "archived_products_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          id: number
          name: string
          timezone: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          timezone?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          timezone?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          bucket_name: string
          file_path: string
          id: number
          product_id: number
          type: string
          uploaded_at: string
        }
        Insert: {
          bucket_name: string
          file_path: string
          id?: never
          product_id: number
          type: string
          uploaded_at?: string
        }
        Update: {
          bucket_name?: string
          file_path?: string
          id?: never
          product_id?: number
          type?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          created_at: string
          expiration_date: string
          household_id: number
          id: number
          main_image_url: string | null
          name: string
          opened: boolean
          opened_date: string | null
          quantity: number
          status: string
          to_buy: boolean
          unit: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          created_at?: string
          expiration_date: string
          household_id: number
          id?: never
          main_image_url?: string | null
          name: string
          opened?: boolean
          opened_date?: string | null
          quantity: number
          status: string
          to_buy?: boolean
          unit: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          created_at?: string
          expiration_date?: string
          household_id?: number
          id?: never
          main_image_url?: string | null
          name?: string
          opened?: boolean
          opened_date?: string | null
          quantity?: number
          status?: string
          to_buy?: boolean
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          auto_generated: boolean
          details: Json | null
          household_id: number
          id: number
          length: number
          spoiled_count: number
          start_date: string
          unit: string
        }
        Insert: {
          auto_generated?: boolean
          details?: Json | null
          household_id: number
          id?: never
          length: number
          spoiled_count?: number
          start_date: string
          unit: string
        }
        Update: {
          auto_generated?: boolean
          details?: Json | null
          household_id?: number
          id?: never
          length?: number
          spoiled_count?: number
          start_date?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      scans_log: {
        Row: {
          household_id: number
          id: number
          operation_type: string
          timestamp: string
        }
        Insert: {
          household_id: number
          id?: never
          operation_type: string
          timestamp?: string
        }
        Update: {
          household_id?: number
          id?: never
          operation_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "scans_log_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_items: {
        Row: {
          id: number
          list_id: number
          product_id: number
          status: string
        }
        Insert: {
          id?: never
          list_id: number
          product_id: number
          status: string
        }
        Update: {
          id?: never
          list_id?: number
          product_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          household_id: number
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          household_id: number
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          household_id?: number
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      user_households: {
        Row: {
          household_id: number
          user_id: string
        }
        Insert: {
          household_id: number
          user_id: string
        }
        Update: {
          household_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_households_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

