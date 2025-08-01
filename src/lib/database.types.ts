export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          admin_id: string
          details: string | null
          id: number
          timestamp: string
        }
        Insert: {
          action: string
          admin_id: string
          details?: string | null
          id?: number
          timestamp?: string
        }
        Update: {
          action?: string
          admin_id?: string
          details?: string | null
          id?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          accent_color: string | null
          allow_registrations: boolean
          background_color: string | null
          footer_text: string | null
          id: number
          logo_url: string | null
          maintenance_mode: boolean
          mpesa_consumer_key: string | null
          mpesa_consumer_secret: string | null
          mpesa_passkey: string | null
          primary_color: string | null
          site_description: string | null
          site_title: string | null
        }
        Insert: {
          accent_color?: string | null
          allow_registrations?: boolean
          background_color?: string | null
          footer_text?: string | null
          id?: number
          logo_url?: string | null
          maintenance_mode?: boolean
          mpesa_consumer_key?: string | null
          mpesa_consumer_secret?: string | null
          mpesa_passkey?: string | null
          primary_color?: string | null
          site_description?: string | null
          site_title?: string | null
        }
        Update: {
          accent_color?: string | null
          allow_registrations?: boolean
          background_color?: string | null
          footer_text?: string | null
          id?: number
          logo_url?: string | null
          maintenance_mode?: boolean
          mpesa_consumer_key?: string | null
          mpesa_consumer_secret?: string | null
          mpesa_passkey?: string | null
          primary_color?: string | null
          site_description?: string | null
          site_title?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string | null
          bestseller: boolean | null
          category_id: number | null
          created_at: string
          data_ai_hint: string | null
          description: string | null
          full_content_url: string | null
          id: string
          is_featured: boolean
          is_subscription: boolean
          price: number
          preview_content: string | null
          publisher_id: string | null
          seo_description: string | null
          seo_title: string | null
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          bestseller?: boolean | null
          category_id?: number | null
          created_at?: string
          data_ai_hint?: string | null
          description?: string | null
          full_content_url?: string | null
          id?: string
          is_featured?: boolean
          is_subscription?: boolean
          price: number
          preview_content?: string | null
          publisher_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          status: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          bestseller?: boolean | null
          category_id?: number | null
          created_at?: string
          data_ai_hint?: string | null
          description?: string | null
          full_content_url?: string | null
          id?: string
          is_featured?: boolean
          is_subscription?: boolean
          price?: number
          preview_content?: string | null
          publisher_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      devotionals: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          message: string
          scheduled_for: string | null
          sent_at: string | null
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          message: string
          scheduled_for?: string | null
          sent_at?: string | null
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          message?: string
          scheduled_for?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotionals_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_by: string | null
          id: string
          message: string
          sent_at: string
          target_audience: string
          title: string
        }
        Insert: {
          created_by?: string | null
          id?: string
          message: string
          sent_at?: string
          target_audience: string
          title: string
        }
        Update: {
          created_by?: string | null
          id?: string
          message?: string
          sent_at?: string
          target_audience?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          full_name: string | null
          id: string
          is_admin: boolean
          phone_number: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          full_name?: string | null
          id: string
          is_admin?: boolean
          phone_number?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          full_name?: string | null
          id?: string
          is_admin?: boolean
          phone_number?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean
          created_at: string
          features: string[] | null
          id: string
          name: string
          period: string
          price: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          features?: string[] | null
          id?: string
          name: string
          period: string
          price: number
        }
        Update: {
          active?: boolean
          created_at?: string
          features?: string[] | null
          id?: string
          name?: string
          period?: string
          price?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          book_id: string | null
          created_at: string
          id: string
          mpesa_code: string | null
          status: string
          subscription_plan_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          book_id?: string | null
          created_at?: string
          id?: string
          mpesa_code?: string | null
          status: string
          subscription_plan_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          book_id?: string | null
          created_at?: string
          id?: string
          mpesa_code?: string | null
          status?: string
          subscription_plan_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_books: {
        Row: {
          book_id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteers: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          interests: string | null
          phone_number: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          interests?: string | null
          phone_number?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interests?: string | null
          phone_number?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          aud: string
          role: string
          email: string
          phone: string
          created_at: string
          last_sign_in_at: string
          app_metadata: Json
          user_metadata: Json
          identities: Json
          updated_at: string
          is_anonymous: boolean
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
