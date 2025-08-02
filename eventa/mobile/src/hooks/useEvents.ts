import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/supabase';

interface EventFilters {
  search?: string;
  type?: 'vote' | 'ticket';
  category?: string;
  status?: 'upcoming' | 'live' | 'ended';
}

interface UseEventsResult {
  events: any[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasMore: boolean;
  searchQuery: string;
  filters: EventFilters;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: EventFilters) => void;
  loadEvents: () => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
}

const EVENTS_PER_PAGE = 10;

export const useEvents = (): UseEventsResult => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<EventFilters>({});

  const loadEvents = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
        setError(null);
      }

      const currentOffset = reset ? 0 : offset;
      
      // Build filters for API call
      const apiFilters: any = {
        limit: EVENTS_PER_PAGE,
        offset: currentOffset,
      };

      if (searchQuery.trim()) {
        apiFilters.search = searchQuery.trim();
      }

      if (filters.type) {
        apiFilters.type = filters.type;
      }

      if (filters.category) {
        apiFilters.category = filters.category;
      }

      const newEvents = await eventService.getEvents(apiFilters);
      
      // Filter by status locally since it's computed
      let filteredEvents = newEvents;
      if (filters.status) {
        filteredEvents = newEvents.filter((event: any) => {
          const now = new Date();
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          
          switch (filters.status) {
            case 'upcoming':
              return now < startDate;
            case 'live':
              return now >= startDate && now <= endDate;
            case 'ended':
              return now > endDate;
            default:
              return true;
          }
        });
      }

      if (reset) {
        setEvents(filteredEvents);
      } else {
        setEvents(prev => [...prev, ...filteredEvents]);
      }

      setOffset(currentOffset + EVENTS_PER_PAGE);
      setHasMore(newEvents.length === EVENTS_PER_PAGE);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [offset, searchQuery, filters]);

  const loadMoreEvents = useCallback(async () => {
    if (!loading && hasMore) {
      await loadEvents(false);
    }
  }, [loading, hasMore, loadEvents]);

  const refreshEvents = useCallback(async () => {
    setRefreshing(true);
    await loadEvents(true);
  }, [loadEvents]);

  // Reload events when search query or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadEvents(true);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  // Initial load
  useEffect(() => {
    loadEvents(true);
  }, []);

  const handleSetFilters = useCallback((newFilters: EventFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    events,
    loading,
    error,
    refreshing,
    hasMore,
    searchQuery,
    filters,
    setSearchQuery: handleSetSearchQuery,
    setFilters: handleSetFilters,
    loadEvents,
    loadMoreEvents,
    refreshEvents,
  };
};