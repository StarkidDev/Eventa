import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Button } from '../../components/Button';
import { TicketCard } from '../../components/TicketCard';
import { eventService, ticketService } from '../../services/supabase';

const { width, height } = Dimensions.get('window');

interface TicketEventDetailScreenProps {
  navigation: any;
  route: {
    params: {
      eventId: string;
    };
  };
}

interface SelectedTicket {
  ticketId: string;
  quantity: number;
  price: number;
}

export const TicketEventDetailScreen: React.FC<TicketEventDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { eventId } = route.params;
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: SelectedTicket }>({});
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEvent(eventId);
      setEvent(eventData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load event data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTicketSelect = (ticket: any) => {
    const currentQuantity = selectedTickets[ticket.id]?.quantity || 0;
    if (currentQuantity === 0) {
      handleQuantityChange(ticket.id, ticket.price, 1);
    }
  };

  const handleQuantityChange = (ticketId: string, price: number, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedTickets };
      delete newSelected[ticketId];
      setSelectedTickets(newSelected);
    } else {
      setSelectedTickets(prev => ({
        ...prev,
        [ticketId]: {
          ticketId,
          quantity,
          price,
        },
      }));
    }
  };

  const getEventStatus = () => {
    if (!event) return { text: 'Loading...', color: Colors.textSecondary };
    
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    if (now < startDate) return { text: 'UPCOMING', color: Colors.info };
    if (now >= startDate && now <= endDate) return { text: 'LIVE', color: Colors.success };
    return { text: 'ENDED', color: Colors.textSecondary };
  };

  const canPurchase = () => {
    if (!event) return false;
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    return now < endDate; // Can purchase until event ends
  };

  const getTotalCost = () => {
    return Object.values(selectedTickets).reduce(
      (total, ticket) => total + (ticket.price * ticket.quantity),
      0
    );
  };

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce(
      (total, ticket) => total + ticket.quantity,
      0
    );
  };

  const handleProceedToPayment = () => {
    const totalTickets = getTotalQuantity();
    const totalCost = getTotalCost();
    
    if (totalTickets === 0) {
      Alert.alert('No Tickets Selected', 'Please select at least one ticket to continue.');
      return;
    }

    // Navigate to payment screen
    navigation.navigate('PaymentScreen', {
      eventId,
      selectedTickets,
      totalCost,
      totalQuantity: totalTickets,
    });
  };

  const handleBuyNow = async () => {
    const totalTickets = getTotalQuantity();
    const totalCost = getTotalCost();
    
    if (totalTickets === 0) {
      Alert.alert('No Tickets Selected', 'Please select at least one ticket to continue.');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Purchase ${totalTickets} ticket${totalTickets > 1 ? 's' : ''} for $${totalCost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy Now', 
          onPress: processPurchase,
          style: 'default'
        },
      ]
    );
  };

  const processPurchase = async () => {
    setProcessingPayment(true);
    try {
      // For now, we'll simulate the purchase process
      // In a real app, this would integrate with Stripe/Flutterwave
      
      const purchases = [];
      for (const [ticketId, selected] of Object.entries(selectedTickets)) {
        const purchase = await ticketService.purchaseTicket(ticketId, selected.quantity);
        purchases.push(purchase);
      }

      Alert.alert(
        'Purchase Successful! 🎉',
        'Your tickets have been purchased successfully. You can view them in your profile.',
        [
          { text: 'View Tickets', onPress: () => navigation.navigate('MyTickets') },
          { text: 'OK', style: 'default' },
        ]
      );

      // Clear selected tickets
      setSelectedTickets({});
      
    } catch (error: any) {
      Alert.alert('Purchase Failed', error.message || 'Unable to complete purchase');
    } finally {
      setProcessingPayment(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Background Image */}
      <View style={styles.headerBackground}>
        {event?.image_url ? (
          <Image source={{ uri: event.image_url }} style={styles.headerImage} />
        ) : (
          <LinearGradient
            colors={[Colors.ticket, Colors.secondary]}
            style={styles.headerGradient}
          />
        )}
        <View style={styles.headerOverlay} />
      </View>

      {/* Header Content */}
      <View style={styles.headerContent}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="ghost"
          size="small"
          icon={<Ionicons name="arrow-back" size={24} color={Colors.surface} />}
          style={styles.backButton}
        />

        <View style={styles.eventInfo}>
          <View style={[styles.statusBadge, { backgroundColor: getEventStatus().color }]}>
            <Text style={styles.statusText}>{getEventStatus().text}</Text>
          </View>
          
          <Text style={styles.eventTitle}>{event?.title}</Text>
          <Text style={styles.eventCategory}>{event?.category}</Text>
          
          <View style={styles.eventDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.surface} />
              <Text style={styles.detailText}>
                {new Date(event?.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            
            {event?.location && (
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color={Colors.surface} />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderTickets = () => {
    if (!event?.tickets || event.tickets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={60} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Tickets Available</Text>
          <Text style={styles.emptyText}>
            Tickets for this event are not yet available or have been sold out.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.ticketsContainer}>
        <Text style={styles.sectionTitle}>Available Tickets</Text>
        {event.tickets.map((ticket: any) => (
          <TicketCard
            key={ticket.id}
            ticket={{
              ...ticket,
              benefits: ticket.type.toLowerCase().includes('vip') 
                ? ['Priority entrance', 'VIP seating area', 'Complimentary drinks', 'Meet & greet access']
                : ticket.type.toLowerCase().includes('premium')
                ? ['Reserved seating', 'Premium location', 'Early entrance']
                : ['General admission', 'Standard seating'],
            }}
            onSelect={handleTicketSelect}
            selectedQuantity={selectedTickets[ticket.id]?.quantity || 0}
            onQuantityChange={(quantity) => handleQuantityChange(ticket.id, ticket.price, quantity)}
            maxQuantityPerUser={10}
          />
        ))}
      </View>
    );
  };

  const renderCheckoutSummary = () => {
    const totalTickets = getTotalQuantity();
    const totalCost = getTotalCost();

    if (totalTickets === 0) return null;

    return (
      <View style={styles.checkoutContainer}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summarySubtitle}>
            {totalTickets} ticket{totalTickets > 1 ? 's' : ''} selected
          </Text>
        </View>

        <View style={styles.summaryItems}>
          {Object.entries(selectedTickets).map(([ticketId, selected]) => {
            const ticket = event?.tickets?.find((t: any) => t.id === ticketId);
            if (!ticket) return null;
            
            return (
              <View key={ticketId} style={styles.summaryItem}>
                <View style={styles.summaryItemInfo}>
                  <Text style={styles.summaryItemName}>{ticket.type}</Text>
                  <Text style={styles.summaryItemDetail}>
                    ${selected.price.toFixed(2)} × {selected.quantity}
                  </Text>
                </View>
                <Text style={styles.summaryItemTotal}>
                  ${(selected.price * selected.quantity).toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summaryTotal}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${totalCost.toFixed(2)}</Text>
        </View>

        <Button
          title={processingPayment ? 'Processing...' : 'Buy Now'}
          onPress={handleBuyNow}
          loading={processingPayment}
          fullWidth
          style={styles.buyButton}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.ticket} />
          <Text style={styles.loadingText}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
          <Text style={styles.errorTitle}>Event Not Found</Text>
          <Text style={styles.errorText}>This event could not be loaded.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadEventData();
            }}
            colors={[Colors.ticket]}
            tintColor={Colors.ticket}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        
        {/* Event Description */}
        {event.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About This Event</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        )}

        {renderTickets()}
        {renderCheckoutSummary()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: height * 0.4,
    position: 'relative',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  eventInfo: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  eventTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  eventCategory: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.surface,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: Spacing.lg,
  },
  eventDetails: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.surface,
    opacity: 0.9,
  },
  descriptionContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  descriptionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  ticketsContainer: {
    paddingVertical: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['4xl'],
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
  },
  checkoutContainer: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  summaryHeader: {
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  summarySubtitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  summaryItems: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
  },
  summaryItemDetail: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  summaryItemTotal: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  totalAmount: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.ticket,
  },
  buyButton: {
    marginTop: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
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
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});