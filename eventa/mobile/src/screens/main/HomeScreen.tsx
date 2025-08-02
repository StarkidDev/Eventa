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
import { authService } from '../../services/supabase';

interface HomeScreenProps {
  navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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

  const [filterType, setFilterType] = useState<'all' | 'vote' | 'ticket'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleEventPress = (event: any) => {
    // Navigate to event detail screen
    Alert.alert('Event Selected', `You selected: ${event.title}`);
    // navigation?.navigate('EventDetail', { eventId: event.id });
  };

  const handleTypeChange = (type: 'all' | 'vote' | 'ticket') => {
    setFilterType(type);
    setFilters({
      ...filters,
      type: type === 'all' ? undefined : type,
    });
  };

  const handleStatusChange = (status: 'all' | 'upcoming' | 'live' | 'ended') => {
    setFilterStatus(status);
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : status,
    });
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setFilters({
      ...filters,
      category,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
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
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Discover amazing events</Text>
        </View>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="ghost"
          size="small"
        />
      </View>
      
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedType={filterType}
        onTypeChange={handleTypeChange}
        selectedStatus={filterStatus}
        onStatusChange={handleStatusChange}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => refreshEvents()}
            style={styles.retryButton}
          />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Ionicons name="calendar-outline" size={60} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>No events found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || Object.keys(filters).length > 0
            ? 'Try adjusting your search or filters'
            : 'Check back later for new events'}
        </Text>
        {(searchQuery || Object.keys(filters).length > 0) && (
          <Button
            title="Clear Filters"
            onPress={() => {
              setSearchQuery('');
              setFilters({});
              setFilterType('all');
              setFilterStatus('all');
              setSelectedCategory(null);
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
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerText}>Loading more events...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshEvents}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={events.length === 0 ? styles.emptyContainer : undefined}
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
  greeting: {
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