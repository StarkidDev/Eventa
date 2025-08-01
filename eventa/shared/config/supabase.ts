import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Environment variables - these should be defined in each app's environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    channels: {
      self: true,
    },
  },
});

// Helper function to create a client with a custom access token (for server-side)
export const createSupabaseClient = (accessToken?: string) => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  });
};

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