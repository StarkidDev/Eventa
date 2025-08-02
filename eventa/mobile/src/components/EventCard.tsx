import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (Spacing.lg * 2);

interface Event {
  id: string;
  title: string;
  type: 'vote' | 'ticket';
  category: string;
  location?: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  organizer?: {
    name: string;
    profile_pic?: string;
  };
  contestants?: Array<{
    id: string;
    name: string;
    media_url?: string;
  }>;
  tickets?: Array<{
    price: number;
    type: string;
    quantity_total: number;
    quantity_sold: number;
  }>;
}

interface EventCardProps {
  event: Event;
  onPress: () => void;
  variant?: 'default' | 'compact';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  variant = 'default',
}) => {
  const isVotingEvent = event.type === 'vote';
  const eventDate = new Date(event.start_date);
  const isOngoing = new Date() >= eventDate && new Date() <= new Date(event.end_date);
  const isUpcoming = new Date() < eventDate;
  
  const getEventStatus = () => {
    if (isOngoing) return { text: 'LIVE', color: Colors.success };
    if (isUpcoming) return { text: 'UPCOMING', color: Colors.info };
    return { text: 'ENDED', color: Colors.textSecondary };
  };

  const getEventPrice = () => {
    if (isVotingEvent) return 'Free to Vote';
    if (!event.tickets?.length) return 'Free';
    
    const prices = event.tickets.map(t => t.price).filter(p => p > 0);
    if (prices.length === 0) return 'Free';
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) return `$${minPrice}`;
    return `$${minPrice} - $${maxPrice}`;
  };

  const getAvailabilityInfo = () => {
    if (isVotingEvent) {
      const contestantCount = event.contestants?.length || 0;
      return `${contestantCount} contestant${contestantCount !== 1 ? 's' : ''}`;
    }
    
    const totalTickets = event.tickets?.reduce((sum, t) => sum + t.quantity_total, 0) || 0;
    const soldTickets = event.tickets?.reduce((sum, t) => sum + t.quantity_sold, 0) || 0;
    const available = totalTickets - soldTickets;
    
    if (available <= 0) return 'Sold Out';
    if (available <= totalTickets * 0.1) return `Only ${available} left`;
    return `${available} available`;
  };

  const status = getEventStatus();

  return (
    <TouchableOpacity
      style={[styles.container, variant === 'compact' && styles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.image_url ? (
            <Image source={{ uri: event.image_url }} style={styles.image} />
          ) : (
            <LinearGradient
              colors={isVotingEvent ? [Colors.vote, Colors.primary] : [Colors.ticket, Colors.secondary]}
              style={styles.imagePlaceholder}
            >
              <Ionicons
                name={isVotingEvent ? 'heart' : 'ticket'}
                size={40}
                color={Colors.surface}
              />
            </LinearGradient>
          )}
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
          
          {/* Event Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: isVotingEvent ? Colors.vote : Colors.ticket }]}>
            <Ionicons
              name={isVotingEvent ? 'heart' : 'ticket'}
              size={12}
              color={Colors.surface}
            />
            <Text style={styles.typeText}>
              {isVotingEvent ? 'VOTE' : 'EVENT'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.category}>{event.category}</Text>
          </View>

          {/* Event Details */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {eventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>

            {event.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {event.organizer?.name || 'Unknown Organizer'}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{getEventPrice()}</Text>
              <Text style={styles.availability}>{getAvailabilityInfo()}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isVotingEvent ? Colors.vote : Colors.ticket }
              ]}
              onPress={onPress}
            >
              <Text style={styles.actionButtonText}>
                {isVotingEvent ? 'Vote Now' : 'Get Tickets'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  compactContainer: {
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  typeBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  category: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  details: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  availability: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.surface,
  },
});