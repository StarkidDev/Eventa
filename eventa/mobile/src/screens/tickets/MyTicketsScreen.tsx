import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Button } from '../../components/Button';
import { QRTicket } from '../../components/QRTicket';
import { ticketService } from '../../services/supabase';

interface MyTicketsScreenProps {
  navigation: any;
}

export const MyTicketsScreen: React.FC<MyTicketsScreenProps> = ({ navigation }) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const userTickets = await ticketService.getUserTickets();
      setTickets(userTickets);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleTicketPress = (ticket: any) => {
    navigation.navigate('TicketDetail', { ticketId: ticket.id });
  };

  const handleShareTicket = async (ticket: any) => {
    try {
      const message = `Check out my ticket for ${ticket.event?.title || 'this event'}!\n\nTicket ID: ${ticket.qr_code}`;
      await Share.share({
        message,
        title: 'Event Ticket',
      });
    } catch (error) {
      console.error('Error sharing ticket:', error);
    }
  };

  const getFilteredTickets = () => {
    if (selectedFilter === 'all') return tickets;
    
    const now = new Date();
    
    return tickets.filter((ticket: any) => {
      if (!ticket.event?.start_date) return selectedFilter === 'all';
      const eventDate = new Date(ticket.event.start_date);
      
      if (selectedFilter === 'upcoming') {
        return eventDate > now;
      } else {
        return eventDate <= now;
      }
    });
  };

  const getTicketStats = () => {
    const now = new Date();
    const upcoming = tickets.filter((ticket: any) => 
      ticket.event?.start_date && new Date(ticket.event.start_date) > now
    ).length;
    const past = tickets.filter((ticket: any) => 
      ticket.event?.start_date && new Date(ticket.event.start_date) <= now
    ).length;
    
    return { total: tickets.length, upcoming, past };
  };

  const renderTicket = ({ item }: { item: any }) => (
    <QRTicket
      purchase={item}
      onPress={() => handleTicketPress(item)}
      onShare={() => handleShareTicket(item)}
      variant="default"
      showQR={true}
    />
  );

  const renderHeader = () => {
    const stats = getTicketStats();
    
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Tickets</Text>
          <Text style={styles.subtitle}>
            {stats.total} ticket{stats.total !== 1 ? 's' : ''} purchased
          </Text>
        </View>

        {/* Stats */}
        {stats.total > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.upcoming}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.past}</Text>
              <Text style={styles.statLabel}>Past Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        )}

        {/* Filter Buttons */}
        {stats.total > 0 && (
          <View style={styles.filterContainer}>
            <Button
              title="All"
              onPress={() => setSelectedFilter('all')}
              variant={selectedFilter === 'all' ? 'primary' : 'ghost'}
              size="small"
              style={styles.filterButton}
            />
            <Button
              title="Upcoming"
              onPress={() => setSelectedFilter('upcoming')}
              variant={selectedFilter === 'upcoming' ? 'primary' : 'ghost'}
              size="small"
              style={styles.filterButton}
            />
            <Button
              title="Past"
              onPress={() => setSelectedFilter('past')}
              variant={selectedFilter === 'past' ? 'primary' : 'ghost'}
              size="small"
              style={styles.filterButton}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.ticket} />
          <Text style={styles.loadingText}>Loading your tickets...</Text>
        </View>
      );
    }

    const filteredTickets = getFilteredTickets();
    
    if (tickets.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="ticket-outline" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Tickets Yet</Text>
          <Text style={styles.emptyText}>
            You haven't purchased any tickets yet. Browse events to get started!
          </Text>
          <Button
            title="Browse Events"
            onPress={() => navigation.navigate('TicketEvents')}
            style={styles.browseButton}
          />
        </View>
      );
    }

    if (filteredTickets.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={60} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>
            No {selectedFilter === 'upcoming' ? 'Upcoming' : 'Past'} Tickets
          </Text>
          <Text style={styles.emptyText}>
            {selectedFilter === 'upcoming' 
              ? 'You have no upcoming events. Browse for new events!'
              : 'No past events found.'
            }
          </Text>
          {selectedFilter !== 'all' && (
            <Button
              title="Show All Tickets"
              onPress={() => setSelectedFilter('all')}
              variant="outline"
              style={styles.showAllButton}
            />
          )}
        </View>
      );
    }

    return null;
  };

  const renderFooter = () => {
    const filteredTickets = getFilteredTickets();
    
    if (filteredTickets.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {filteredTickets.length} of {tickets.length} tickets
        </Text>
        
        <Button
          title="Browse More Events"
          onPress={() => navigation.navigate('TicketEvents')}
          variant="outline"
          size="small"
          style={styles.browseMoreButton}
        />
      </View>
    );
  };

  const filteredTickets = getFilteredTickets();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.ticket]}
            tintColor={Colors.ticket}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredTickets.length === 0 ? styles.emptyContainer : undefined}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.ticket,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
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
  emptyTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  browseButton: {
    minWidth: 150,
  },
  showAllButton: {
    minWidth: 120,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
  },
  browseMoreButton: {
    minWidth: 140,
  },
});