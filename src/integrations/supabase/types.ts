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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bank_statements: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          file_size: number | null
          filename: string
          id: string
          processing_status: string | null
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          file_size?: number | null
          filename: string
          id?: string
          processing_status?: string | null
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          file_size?: number | null
          filename?: string
          id?: string
          processing_status?: string | null
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          active_deals: number | null
          category: string
          connections: number | null
          created_at: string
          description: string | null
          id: string
          location: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_deals?: number | null
          category: string
          connections?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_deals?: number | null
          category?: string
          connections?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deal_opportunities: {
        Row: {
          created_at: string
          creator_user_id: string
          deal_type: string
          description: string
          id: string
          industry: string | null
          interested_parties: number | null
          investment_range_max: number | null
          investment_range_min: number | null
          location: string | null
          status: string | null
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          created_at?: string
          creator_user_id: string
          deal_type: string
          description: string
          id?: string
          industry?: string | null
          interested_parties?: number | null
          investment_range_max?: number | null
          investment_range_min?: number | null
          location?: string | null
          status?: string | null
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          created_at?: string
          creator_user_id?: string
          deal_type?: string
          description?: string
          id?: string
          industry?: string | null
          interested_parties?: number | null
          investment_range_max?: number | null
          investment_range_min?: number | null
          location?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          company_name: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      financial_accounts: {
        Row: {
          account_name: string
          account_type: string
          bank_name: string | null
          created_at: string
          current_balance: number | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          bank_name?: string | null
          created_at?: string
          current_balance?: number | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          bank_name?: string | null
          created_at?: string
          current_balance?: number | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string
          business_type: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          location: string | null
          logo_url: string | null
          phone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          business_name: string
          business_type?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          location?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          location?: string | null
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      spending_insights: {
        Row: {
          created_at: string
          description: string
          id: string
          insight_type: string
          metadata: Json | null
          potential_savings: number | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          insight_type: string
          metadata?: Json | null
          potential_savings?: number | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          metadata?: Json | null
          potential_savings?: number | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          ai_parsed: boolean | null
          amount: number
          category: string | null
          created_at: string
          date: string
          description: string
          id: string
          merchant: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          ai_parsed?: boolean | null
          amount: number
          category?: string | null
          created_at?: string
          date: string
          description: string
          id?: string
          merchant?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          ai_parsed?: boolean | null
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          merchant?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_deal_views: {
        Args: { deal_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "moderator" | "user"
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
      app_role: ["owner", "moderator", "user"],
    },
  },
} as const
