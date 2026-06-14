export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      budgets: {
        Row: {
          category_id: string | null
          created_at: string
          fiscal_year: number
          id: string
          planned_cents: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          fiscal_year: number
          id?: string
          planned_cents?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          fiscal_year?: number
          id?: string
          planned_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_interactions: {
        Row: {
          body: string | null
          completed: boolean
          contact_id: string
          created_at: string
          created_by: string | null
          follow_up_at: string | null
          id: string
          occurred_at: string
          subject: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at: string
        }
        Insert: {
          body?: string | null
          completed?: boolean
          contact_id: string
          created_at?: string
          created_by?: string | null
          follow_up_at?: string | null
          id?: string
          occurred_at?: string
          subject?: string | null
          type?: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string
        }
        Update: {
          body?: string | null
          completed?: boolean
          contact_id?: string
          created_at?: string
          created_by?: string | null
          follow_up_at?: string | null
          id?: string
          occurred_at?: string
          subject?: string | null
          type?: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          id: string
          lifecycle_stage: Database["public"]["Enums"]["lifecycle_stage"]
          notes: string | null
          organization: string | null
          phone: string | null
          source: string | null
          tags: string[]
          type: Database["public"]["Enums"]["contact_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          id?: string
          lifecycle_stage?: Database["public"]["Enums"]["lifecycle_stage"]
          notes?: string | null
          organization?: string | null
          phone?: string | null
          source?: string | null
          tags?: string[]
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          id?: string
          lifecycle_stage?: Database["public"]["Enums"]["lifecycle_stage"]
          notes?: string | null
          organization?: string | null
          phone?: string | null
          source?: string | null
          tags?: string[]
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount_cents: number
          contact_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          designation: string | null
          donor_email: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          method: Database["public"]["Enums"]["donation_method"]
          notes: string | null
          receipt_number: number | null
          received_at: string
          status: Database["public"]["Enums"]["donation_status"]
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          designation?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          method?: Database["public"]["Enums"]["donation_method"]
          notes?: string | null
          receipt_number?: number | null
          received_at?: string
          status?: Database["public"]["Enums"]["donation_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          designation?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          method?: Database["public"]["Enums"]["donation_method"]
          notes?: string | null
          receipt_number?: number | null
          received_at?: string
          status?: Database["public"]["Enums"]["donation_status"]
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          slug: string
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          slug: string
          starts_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          slug?: string
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          annual_budget_cents: number
          created_at: string
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          annual_budget_cents?: number
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          annual_budget_cents?: number
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount_cents: number
          category_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string
          id: string
          incurred_at: string
          paid_at: string | null
          program_pillar: string | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["expense_status"]
          updated_at: string
          vendor: string | null
        }
        Insert: {
          amount_cents: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description: string
          id?: string
          incurred_at?: string
          paid_at?: string | null
          program_pillar?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          amount_cents?: number
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          id?: string
          incurred_at?: string
          paid_at?: string | null
          program_pillar?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt: string
          created_at: string
          height: number | null
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          tags: string[]
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt?: string
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          tags?: string[]
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt?: string
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          tags?: string[]
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author_id: string | null
          body_md: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_md?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_md?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_settings: {
        Row: {
          content: Json
          page_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          page_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          page_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          created_at: string
          donation_id: string
          id: string
          issued_at: string
          issued_by: string | null
          receipt_number: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          donation_id: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          receipt_number: number
          storage_path: string
        }
        Update: {
          created_at?: string
          donation_id?: string
          id?: string
          issued_at?: string
          issued_by?: string | null
          receipt_number?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_members: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          photo_url: string | null
          role_title: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          photo_url?: string | null
          role_title: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          photo_url?: string | null
          role_title?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      staff_members_public: {
        Row: {
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          photo_url: string | null
          role_title: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          photo_url?: string | null
          role_title?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          photo_url?: string | null
          role_title?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "member"
      contact_type: "donor" | "lead" | "partner" | "volunteer" | "beneficiary"
      donation_method:
        | "stripe"
        | "cash"
        | "bank_transfer"
        | "cheque"
        | "mobile_money"
        | "other"
      donation_status: "pending" | "completed" | "refunded" | "failed"
      expense_status: "planned" | "approved" | "paid" | "cancelled"
      interaction_type: "email" | "call" | "meeting" | "note" | "task"
      lifecycle_stage: "lead" | "qualified" | "engaged" | "donor" | "lapsed"
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
  public: {
    Enums: {
      app_role: ["admin", "editor", "member"],
      contact_type: ["donor", "lead", "partner", "volunteer", "beneficiary"],
      donation_method: [
        "stripe",
        "cash",
        "bank_transfer",
        "cheque",
        "mobile_money",
        "other",
      ],
      donation_status: ["pending", "completed", "refunded", "failed"],
      expense_status: ["planned", "approved", "paid", "cancelled"],
      interaction_type: ["email", "call", "meeting", "note", "task"],
      lifecycle_stage: ["lead", "qualified", "engaged", "donor", "lapsed"],
    },
  },
} as const
