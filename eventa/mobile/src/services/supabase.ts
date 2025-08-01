import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../../../shared/types/database';

// Environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Set to false for React Native
    storage: AsyncStorage,
  },
});

// Database table names for easier reference
export const TABLES = {
  USERS: 'users',
  ORGANIZER_APPLICATIONS: 'organizer_applications',
  EVENTS: 'events',
  CONTESTANTS: 'contestants',
  VOTES: 'votes',
  TICKETS: 'tickets',
  PURCHASES: 'purchases',
  CHECK_INS: 'check_ins',
  RESULTS_SNAPSHOT: 'results_snapshot',
} as const;

// Real-time channel names
export const CHANNELS = {
  VOTES: 'votes',
  EVENTS: 'events',
  TICKETS: 'tickets',
  PURCHASES: 'purchases',
} as const;

// Auth helpers
export const authService = {
  async signUp(email: string, password: string, userData?: { name?: string; role?: 'voter' | 'organizer' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) throw error;
    
    // Create user profile
    if (data.user && userData) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
          role: userData.role || 'voter',
        });
      
      if (profileError) throw profileError;
    }
    
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage
    await AsyncStorage.clear();
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<{
    name: string;
    profile_pic: string;
  }>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Event service
export const eventService = {
  async getEvents(filters: {
    type?: 'vote' | 'ticket';
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:users!organizer_id(name, profile_pic),
        contestants(id, name, media_url, code),
        tickets(id, type, price, quantity_total, quantity_sold)
      `)
      .eq('is_published', true)
      .order('start_date', { ascending: true });

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getEvent(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users!organizer_id(name, email, profile_pic),
        contestants(id, name, bio, media_url, code),
        tickets(id, type, price, quantity_total, quantity_sold)
      `)
      .eq('id', eventId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getVoteStats(eventId: string) {
    const { data, error } = await supabase.rpc('get_vote_stats', {
      event_uuid: eventId
    });
    
    if (error) throw error;
    return data;
  },
};

// Voting service
export const votingService = {
  async vote(eventId: string, contestantId: string, voteCount: number = 1) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('votes')
      .insert({
        user_id: user.id,
        event_id: eventId,
        contestant_id: contestantId,
        method: 'app',
        vote_count: voteCount,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserVotes(eventId: string) {
    const user = await authService.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('votes')
      .select(`
        *,
        contestant:contestants(name, media_url)
      `)
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};

// Ticket service
export const ticketService = {
  async purchaseTicket(ticketId: string, quantity: number) {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (ticketError) throw ticketError;
    
    const totalAmount = ticket.price * quantity;
    const qrCode = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        ticket_id: ticketId,
        quantity,
        total_amount: totalAmount,
        qr_code: qrCode,
        payment_status: 'pending',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserTickets() {
    const user = await authService.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        ticket:tickets(*),
        event:tickets(event_id, events(*))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async checkInTicket(qrCode: string, eventId: string) {
    const { data, error } = await supabase
      .from('check_ins')
      .insert({
        purchase_id: qrCode, // This would be properly resolved in production
        event_id: eventId,
        check_in_time: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};