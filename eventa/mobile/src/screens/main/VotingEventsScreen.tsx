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

interface VotingEventsScreenProps {
  navigation?: any;
}

export const VotingEventsScreen: React.FC<VotingEventsScreenProps> = ({ navigation }) => {
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

  // Filter events to only show voting events
  const votingEvents = events.filter(event => event.type === 'vote');

  React.useEffect(() => {
    // Set the type filter to 'vote' when component mounts
    setFilters({ ...filters, type: 'vote' });
  }, []);

  const handleEventPress = (event: any) => {
    // Navigate to voting event detail screen
    Alert.alert('Voting Event', `Start voting for: ${event.title}`);
    // navigation?.navigate('VotingEventDetail', { eventId: event.id });
  };

  const handleStatusChange = (status: 'all' | 'upcoming' | 'live' | 'ended') => {
    setFilterStatus(status);
    setFilters({
      ...filters,
      type: 'vote', // Always keep vote type
      status: status === 'all' ? undefined : status,
    });
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setFilters({
      ...filters,
      type: 'vote', // Always keep vote type
      category,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>✨ Voting Events</Text>
          <Text style={styles.subtitle}>Cast your votes and see live results</Text>
        </View>
        
        {/* Live events indicator */}
        {votingEvents.some(event => {
          const now = new Date();
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          return now >= startDate && now <= endDate;
        }) && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedType="vote" // Fixed to vote
        onTypeChange={() => {}} // No-op since type is fixed
        selectedStatus={filterStatus}
        onStatusChange={handleStatusChange}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.vote} />
          <Text style={styles.loadingText}>Loading voting events...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
          <Text style={styles.errorTitle}>Unable to load voting events</Text>
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
        <Ionicons name="heart-outline" size={60} color={Colors.vote} />
        <Text style={styles.emptyTitle}>No voting events found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || selectedCategory
            ? 'Try adjusting your search or category filter'
            : 'Be the first to know when new voting events are available!'}
        </Text>
        {(searchQuery || selectedCategory) && (
          <Button
            title="Clear Filters"
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setFilterStatus('all');
              setFilters({ type: 'vote' });
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
        <ActivityIndicator size="small" color={Colors.vote} />
        <Text style={styles.footerText}>Loading more voting events...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={votingEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshEvents}
            colors={[Colors.vote]}
            tintColor={Colors.vote}
          />
        }
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={votingEvents.length === 0 ? styles.emptyContainer : undefined}
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
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    gap: Spacing.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  liveText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
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