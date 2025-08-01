export * from './database';

// User Types
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'voter' | 'organizer' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  profile_pic?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  type: 'vote' | 'ticket';
  organizer_id: string;
  category: string;
  location?: string | null;
  description?: string | null;
  start_date: string;
  end_date: string;
  image_url?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string | null;
  // Populated relationships
  organizer?: User;
  contestants?: Contestant[];
  tickets?: Ticket[];
  vote_stats?: VoteStats;
}

// Contestant Types
export interface Contestant {
  id: string;
  event_id: string;
  name: string;
  bio?: string | null;
  media_url?: string | null;
  code: string;
  created_at: string;
  updated_at?: string | null;
  // Computed fields
  vote_count?: number;
  ranking?: number;
}

// Vote Types
export interface Vote {
  id: string;
  user_id?: string | null;
  event_id: string;
  contestant_id: string;
  method: 'app' | 'ussd';
  vote_count: number;
  phone_number?: string | null;
  created_at: string;
}

export interface VoteStats {
  total_votes: number;
  contestants: Array<{
    contestant_id: string;
    name: string;
    vote_count: number;
    percentage: number;
  }>;
  by_method: {
    app: number;
    ussd: number;
  };
}

// Ticket Types
export interface Ticket {
  id: string;
  event_id: string;
  type: string;
  price: number;
  quantity_total: number;
  quantity_sold: number;
  created_at: string;
  updated_at?: string | null;
  // Computed fields
  availability: 'available' | 'limited' | 'sold_out';
}

// Purchase Types
export interface Purchase {
  id: string;
  user_id: string;
  ticket_id: string;
  quantity: number;
  total_amount: number;
  qr_code: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string | null;
  created_at: string;
  updated_at?: string | null;
  // Populated relationships
  ticket?: Ticket;
  event?: Event;
  check_in?: CheckIn;
}

// Check-in Types
export interface CheckIn {
  id: string;
  purchase_id: string;
  event_id: string;
  check_in_time: string;
  created_at: string;
}

// Organizer Application Types
export interface OrganizerApplication {
  id: string;
  user_id: string;
  org_name: string;
  gov_id_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string | null;
  // Populated relationships
  user?: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search Types
export interface EventFilters {
  type?: 'vote' | 'ticket';
  category?: string;
  location?: string;
  status?: 'upcoming' | 'live' | 'ended';
  search?: string;
  organizer_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Navigation Types
export interface TabBarItem {
  name: string;
  icon: string;
  component: React.ComponentType;
  badge?: number;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}