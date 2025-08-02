import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Button } from '../../components/Button';
import { EventCard } from '../../components/EventCard';
import { SearchFilter } from '../../components/SearchFilter';
import { useEvents } from '../../hooks/useEvents';

interface TicketEventsScreenProps {
  navigation?: any;
}

export const TicketEventsScreen: React.FC<TicketEventsScreenProps> = ({ navigation }) => {
  const {
    events,
    loading,
    error,
    refreshing,
    hasMore,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    loadMoreEvents,
    refreshEvents,
  } = useEvents();

  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter events to only show ticket events
  const ticketEvents = events.filter(event => event.type === 'ticket');

  React.useEffect(() => {
    // Set the type filter to 'ticket' when component mounts
    setFilters({ ...filters, type: 'ticket' });
  }, []);

  const handleEventPress = (event: any) => {
    // Navigate to ticket event detail screen
    Alert.alert('Ticket Event', `Get tickets for: ${event.title}`);
    // navigation?.navigate('TicketEventDetail', { eventId: event.id });
  };

  const handleStatusChange = (status: 'all' | 'upcoming' | 'live' | 'ended') => {
    setFilterStatus(status);
    setFilters({
      ...filters,
      type: 'ticket', // Always keep ticket type
      status: status === 'all' ? undefined : status,
    });
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setFilters({
      ...filters,
      type: 'ticket', // Always keep ticket type
      category,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const getTicketsSoldInfo = () => {
    const totalTickets = ticketEvents.reduce((sum, event) => {
      return sum + (event.tickets?.reduce((ticketSum: number, ticket: any) => 
        ticketSum + ticket.quantity_total, 0) || 0);
    }, 0);
    
    const soldTickets = ticketEvents.reduce((sum, event) => {
      return sum + (event.tickets?.reduce((ticketSum: number, ticket: any) => 
        ticketSum + ticket.quantity_sold, 0) || 0);
    }, 0);

    return { totalTickets, soldTickets };
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item)}
    />
  );

  const renderHeader = () => {
    const { totalTickets, soldTickets } = getTicketsSoldInfo();
    
    return (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>🎟️ Ticket Events</Text>
            <Text style={styles.subtitle}>Discover and book amazing events</Text>
          </View>
          
          {/* Ticket availability indicator */}
          {ticketEvents.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsNumber}>{ticketEvents.length}</Text>
              <Text style={styles.statsLabel}>Events</Text>
            </View>
          )}
        </View>
        
        {/* Sales stats */}
        {totalTickets > 0 && (
          <View style={styles.salesStats}>
            <View style={styles.salesItem}>
              <Text style={styles.salesNumber}>{soldTickets.toLocaleString()}</Text>
              <Text style={styles.salesLabel}>Tickets Sold</Text>
            </View>
            <View style={styles.salesItem}>
              <Text style={styles.salesNumber}>{(totalTickets - soldTickets).toLocaleString()}</Text>
              <Text style={styles.salesLabel}>Available</Text>
            </View>
            <View style={styles.salesItem}>
              <Text style={styles.salesNumber}>{Math.round((soldTickets / totalTickets) * 100)}%</Text>
              <Text style={styles.salesLabel}>Sold Out</Text>
            </View>
          </View>
        )}
        
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedType="ticket" // Fixed to ticket
          onTypeChange={() => {}} // No-op since type is fixed
          selectedStatus={filterStatus}
          onStatusChange={handleStatusChange}
        />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.ticket} />
          <Text style={styles.loadingText}>Loading ticket events...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
          <Text style={styles.errorTitle}>Unable to load ticket events</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={() => refreshEvents()}
            style={styles.retryButton}
          />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Ionicons name="ticket-outline" size={60} color={Colors.ticket} />
        <Text style={styles.emptyTitle}>No ticket events found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || selectedCategory
            ? 'Try adjusting your search or category filter'
            : 'Stay tuned for exciting events coming your way!'}
        </Text>
        {(searchQuery || selectedCategory) && (
          <Button
            title="Clear Filters"
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setFilterStatus('all');
              setFilters({ type: 'ticket' });
            }}
            variant="outline"
            style={styles.clearButton}
          />
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore || loading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.ticket} />
        <Text style={styles.footerText}>Loading more ticket events...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ticketEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshEvents}
            colors={[Colors.ticket]}
            tintColor={Colors.ticket}
          />
        }
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ticketEvents.length === 0 ? styles.emptyContainer : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsContainer: {
    alignItems: 'center',
    backgroundColor: Colors.ticket,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    minWidth: 60,
  },
  statsNumber: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  statsLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.surface,
    opacity: 0.9,
  },
  salesStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  salesItem: {
    alignItems: 'center',
  },
  salesNumber: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  salesLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['4xl'],
  },
  loadingText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  clearButton: {
    minWidth: 120,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
  },
});