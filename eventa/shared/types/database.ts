export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          role: 'voter' | 'organizer' | 'admin';
          status: 'active' | 'suspended' | 'pending';
          profile_pic: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          role?: 'voter' | 'organizer' | 'admin';
          status?: 'active' | 'suspended' | 'pending';
          profile_pic?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          role?: 'voter' | 'organizer' | 'admin';
          status?: 'active' | 'suspended' | 'pending';
          profile_pic?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      organizer_applications: {
        Row: {
          id: string;
          user_id: string;
          org_name: string;
          gov_id_url: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          org_name: string;
          gov_id_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          org_name?: string;
          gov_id_url?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          type: 'vote' | 'ticket';
          organizer_id: string;
          category: string;
          location: string | null;
          description: string | null;
          start_date: string;
          end_date: string;
          image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          type: 'vote' | 'ticket';
          organizer_id: string;
          category: string;
          location?: string | null;
          description?: string | null;
          start_date: string;
          end_date: string;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          type?: 'vote' | 'ticket';
          organizer_id?: string;
          category?: string;
          location?: string | null;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      contestants: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          bio: string | null;
          media_url: string | null;
          code: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          bio?: string | null;
          media_url?: string | null;
          code: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          bio?: string | null;
          media_url?: string | null;
          code?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      votes: {
        Row: {
          id: string;
          user_id: string | null;
          event_id: string;
          contestant_id: string;
          method: 'app' | 'ussd';
          vote_count: number;
          phone_number: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_id: string;
          contestant_id: string;
          method: 'app' | 'ussd';
          vote_count?: number;
          phone_number?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_id?: string;
          contestant_id?: string;
          method?: 'app' | 'ussd';
          vote_count?: number;
          phone_number?: string | null;
          created_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          event_id: string;
          type: string;
          price: number;
          quantity_total: number;
          quantity_sold: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          type: string;
          price: number;
          quantity_total: number;
          quantity_sold?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          type?: string;
          price?: number;
          quantity_total?: number;
          quantity_sold?: number;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          ticket_id: string;
          quantity: number;
          total_amount: number;
          qr_code: string;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          ticket_id: string;
          quantity: number;
          total_amount: number;
          qr_code: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          ticket_id?: string;
          quantity?: number;
          total_amount?: number;
          qr_code?: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      check_ins: {
        Row: {
          id: string;
          purchase_id: string;
          event_id: string;
          check_in_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          purchase_id: string;
          event_id: string;
          check_in_time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          purchase_id?: string;
          event_id?: string;
          check_in_time?: string;
          created_at?: string;
        };
      };
      results_snapshot: {
        Row: {
          id: string;
          event_id: string;
          contestant_id: string;
          total_votes: number;
          snapshot_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          contestant_id: string;
          total_votes: number;
          snapshot_time: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          contestant_id?: string;
          total_votes?: number;
          snapshot_time?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}