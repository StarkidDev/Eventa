import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');
const TICKET_WIDTH = width - (Spacing.lg * 2);

interface Purchase {
  id: string;
  qr_code: string;
  quantity: number;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  ticket?: {
    type: string;
    price: number;
  };
  event?: {
    title: string;
    start_date: string;
    end_date: string;
    location?: string;
    image_url?: string;
  };
}

interface QRTicketProps {
  purchase: Purchase;
  onPress?: () => void;
  onShare?: () => void;
  variant?: 'default' | 'compact';
  showQR?: boolean;
}

export const QRTicket: React.FC<QRTicketProps> = ({
  purchase,
  onPress,
  onShare,
  variant = 'default',
  showQR = true,
}) => {
  const getStatusColor = () => {
    switch (purchase.payment_status) {
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      case 'refunded':
        return Colors.textSecondary;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (purchase.payment_status) {
      case 'completed':
        return 'VALID';
      case 'pending':
        return 'PENDING';
      case 'failed':
        return 'FAILED';
      case 'refunded':
        return 'REFUNDED';
      default:
        return 'UNKNOWN';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isEventPassed = () => {
    if (!purchase.event?.end_date) return false;
    return new Date() > new Date(purchase.event.end_date);
  };

  const canUseTicket = () => {
    return purchase.payment_status === 'completed' && !isEventPassed();
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          !canUseTicket() && styles.compactContainerDisabled,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactInfo}>
            <Text style={styles.compactEventTitle} numberOfLines={1}>
              {purchase.event?.title || 'Event Ticket'}
            </Text>
            <Text style={styles.compactTicketType}>
              {purchase.ticket?.type} × {purchase.quantity}
            </Text>
            <Text style={styles.compactDate}>
              {purchase.event?.start_date && formatDate(purchase.event.start_date)}
            </Text>
          </View>
          
          <View style={styles.compactRight}>
            <View style={[styles.compactStatus, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.compactStatusText}>{getStatusText()}</Text>
            </View>
            
            {showQR && canUseTicket() && (
              <View style={styles.compactQR}>
                <QRCode
                  value={purchase.qr_code}
                  size={40}
                  backgroundColor="transparent"
                  color={Colors.text}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !canUseTicket() && styles.containerDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.ticket}>
        {/* Ticket Header */}
        <LinearGradient
          colors={[Colors.ticket, Colors.secondary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle} numberOfLines={2}>
                {purchase.event?.title || 'Event Ticket'}
              </Text>
              <Text style={styles.ticketType}>
                {purchase.ticket?.type}
              </Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Ticket Body */}
        <View style={styles.body}>
          <View style={styles.leftSection}>
            {/* Event Details */}
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>
                    {purchase.event?.start_date && formatDate(purchase.event.start_date)}
                  </Text>
                </View>
              </View>

              {purchase.event?.location && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {purchase.event.location}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <Ionicons name="ticket-outline" size={16} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>
                    {purchase.quantity} ticket{purchase.quantity > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={16} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Total Paid</Text>
                  <Text style={styles.detailValue}>
                    ${purchase.total_amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Purchase Info */}
            <View style={styles.purchaseInfo}>
              <Text style={styles.purchaseId}>
                Purchase ID: {purchase.id.slice(0, 8)}...
              </Text>
              <Text style={styles.purchaseDate}>
                Purchased: {formatDate(purchase.created_at)}
              </Text>
            </View>
          </View>

          {/* QR Code Section */}
          {showQR && (
            <View style={styles.qrSection}>
              <View style={styles.qrContainer}>
                {canUseTicket() ? (
                  <>
                    <QRCode
                      value={purchase.qr_code}
                      size={120}
                      backgroundColor="transparent"
                      color={Colors.text}
                    />
                    <Text style={styles.qrLabel}>Scan to Enter</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.qrPlaceholder}>
                      <Ionicons 
                        name={
                          purchase.payment_status === 'pending' 
                            ? 'time-outline' 
                            : isEventPassed()
                            ? 'checkmark-circle-outline'
                            : 'close-circle-outline'
                        } 
                        size={60} 
                        color={Colors.textSecondary} 
                      />
                    </View>
                    <Text style={styles.qrLabel}>
                      {purchase.payment_status === 'pending' 
                        ? 'Payment Pending'
                        : isEventPassed()
                        ? 'Event Ended'
                        : 'Not Valid'}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Ticket Actions */}
        {canUseTicket() && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <Ionicons name="expand-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionText}>View Full</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Decorative Perforations */}
        <View style={styles.perforations}>
          {Array.from({ length: 20 }).map((_, index) => (
            <View key={index} style={styles.perforation} />
          ))}
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
  containerDisabled: {
    opacity: 0.7,
  },
  ticket: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
    position: 'relative',
  },
  header: {
    padding: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  eventTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  ticketType: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.surface,
    opacity: 0.9,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  body: {
    flexDirection: 'row',
    padding: Spacing.lg,
  },
  leftSection: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  details: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
  },
  purchaseInfo: {
    gap: Spacing.xs,
  },
  purchaseId: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  purchaseDate: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  qrSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qrLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  perforations: {
    position: 'absolute',
    left: '60%',
    top: 0,
    bottom: 0,
    width: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  perforation: {
    width: 2,
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 1,
  },

  // Compact variant styles
  compactContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  compactContainerDisabled: {
    opacity: 0.7,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactEventTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  compactTicketType: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.ticket,
    marginBottom: Spacing.xs,
  },
  compactDate: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  compactRight: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  compactStatusText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  compactQR: {
    padding: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
  },
});