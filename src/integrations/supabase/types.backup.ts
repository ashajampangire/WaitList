export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

interface DatabaseSchema {
  public: {
    Tables: {
      waitlist_entries: {
        Row: {
          id: string
          created_at: string
          discord_joined: boolean
          email: string
          email_connected: boolean
          name: string | null
          referral_code: string
          referred_by_code: string | null
          twitter_followed: boolean
          twitter_username: string | null
          wallet_address: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          discord_joined?: boolean
          email: string
          email_connected?: boolean
          name?: string | null
          referral_code?: string
          referred_by_code?: string | null
          twitter_followed?: boolean
          twitter_username?: string | null
          wallet_address?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          discord_joined?: boolean
          email?: string
          email_connected?: boolean
          name?: string | null
          referral_code?: string
          referred_by_code?: string | null
          twitter_followed?: boolean
          twitter_username?: string | null
          wallet_address?: string | null
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          created_at: string
          referrer_email: string
          referred_email: string
        }
        Insert: {
          id?: string
          created_at?: string
          referrer_email: string
          referred_email: string
        }
        Update: {
          id?: string
          created_at?: string
          referrer_email?: string
          referred_email?: string
        }
      }
    }
  }
}

export type Database = {
  public: {
    Tables: {
      waitlist_entries: {
        Row: {
          id: string
          created_at: string
          discord_joined: boolean | null
          email: string
          email_connected: boolean | null
          name: string | null
          referral_code: string
          referred_by_code: string | null
          twitter_followed: boolean | null
          twitter_username: string | null
          wallet_address: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          discord_joined?: boolean | null
          email: string
          email_connected?: boolean | null
          name?: string | null
          referral_code?: string
          referred_by_code?: string | null
          twitter_followed?: boolean | null
          twitter_username?: string | null
          wallet_address?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          discord_joined?: boolean | null
          email?: string
          email_connected?: boolean | null
          name?: string | null
          referral_code?: string
          referred_by_code?: string | null
          twitter_followed?: boolean | null
          twitter_username?: string | null
          wallet_address?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_email: string
          referrer_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_email: string
          referrer_email: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_email?: string
          referrer_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_email_fkey"
            columns: ["referred_email"]
            isOneToOne: false
            referencedRelation: "waitlist_entries"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "referrals_referrer_email_fkey"
            columns: ["referrer_email"]
            isOneToOne: false
            referencedRelation: "waitlist_entries"
            referencedColumns: ["email"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_referral_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          email: string
          name: string
          referral_count: number
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
