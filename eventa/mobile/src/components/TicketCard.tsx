import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

interface Ticket {
  id: string;
  type: string;
  price: number;
  quantity_total: number;
  quantity_sold: number;
  description?: string;
  benefits?: string[];
}

interface TicketCardProps {
  ticket: Ticket;
  onSelect: (ticket: Ticket) => void;
  selectedQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  maxQuantityPerUser?: number;
  variant?: 'default' | 'compact' | 'selected';
  isLoading?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onSelect,
  selectedQuantity = 0,
  onQuantityChange,
  maxQuantityPerUser = 10,
  variant = 'default',
  isLoading = false,
}) => {
  const availableTickets = ticket.quantity_total - ticket.quantity_sold;
  const isAvailable = availableTickets > 0;
  const isSoldOut = availableTickets <= 0;
  const isLimitedAvailability = availableTickets <= ticket.quantity_total * 0.1;
  const isSelected = selectedQuantity > 0;

  const getAvailabilityStatus = () => {
    if (isSoldOut) return { text: 'SOLD OUT', color: Colors.error };
    if (isLimitedAvailability) return { text: 'LIMITED', color: Colors.warning };
    return { text: 'AVAILABLE', color: Colors.success };
  };

  const getTicketTypeIcon = () => {
    const type = ticket.type.toLowerCase();
    if (type.includes('vip')) return 'star';
    if (type.includes('premium')) return 'diamond';
    if (type.includes('general')) return 'people';
    if (type.includes('early')) return 'time';
    return 'ticket';
  };

  const handleQuantityChange = (change: number) => {
    if (!onQuantityChange) return;
    
    const newQuantity = Math.max(0, Math.min(
      selectedQuantity + change,
      Math.min(availableTickets, maxQuantityPerUser)
    ));
    
    onQuantityChange(newQuantity);
  };

  const handleSelectTicket = () => {
    if (isAvailable && !isLoading) {
      onSelect(ticket);
    }
  };

  const status = getAvailabilityStatus();

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          isSelected && styles.compactContainerSelected,
          isSoldOut && styles.compactContainerDisabled,
        ]}
        onPress={handleSelectTicket}
        disabled={isSoldOut || isLoading}
        activeOpacity={0.8}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactInfo}>
            <View style={styles.compactHeader}>
              <Text style={[styles.compactType, isSoldOut && styles.disabledText]}>
                {ticket.type}
              </Text>
              <View style={[styles.compactStatus, { backgroundColor: status.color }]}>
                <Text style={styles.compactStatusText}>{status.text}</Text>
              </View>
            </View>
            <Text style={[styles.compactPrice, isSoldOut && styles.disabledText]}>
              ${ticket.price.toFixed(2)}
            </Text>
            <Text style={styles.compactAvailability}>
              {availableTickets} of {ticket.quantity_total} available
            </Text>
          </View>
          
          {isSelected && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{selectedQuantity}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        isSoldOut && styles.containerDisabled,
      ]}
      onPress={handleSelectTicket}
      disabled={isSoldOut || isLoading}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.ticketInfo}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={getTicketTypeIcon()}
                size={24}
                color={isSoldOut ? Colors.textSecondary : Colors.ticket}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.ticketType, isSoldOut && styles.disabledText]}>
                {ticket.type}
              </Text>
              {ticket.description && (
                <Text style={[styles.description, isSoldOut && styles.disabledText]}>
                  {ticket.description}
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={[styles.price, isSoldOut && styles.disabledText]}>
            ${ticket.price.toFixed(2)}
          </Text>
          <Text style={styles.priceLabel}>per ticket</Text>
        </View>

        {/* Benefits */}
        {ticket.benefits && ticket.benefits.length > 0 && (
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Includes:</Text>
            {ticket.benefits.slice(0, 3).map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={isSoldOut ? Colors.textSecondary : Colors.success}
                />
                <Text style={[styles.benefitText, isSoldOut && styles.disabledText]}>
                  {benefit}
                </Text>
              </View>
            ))}
            {ticket.benefits.length > 3 && (
              <Text style={styles.moreBenefits}>
                +{ticket.benefits.length - 3} more benefits
              </Text>
            )}
          </View>
        )}

        {/* Availability */}
        <View style={styles.availabilityContainer}>
          <View style={styles.availabilityInfo}>
            <Text style={styles.availabilityText}>
              {availableTickets} of {ticket.quantity_total} remaining
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(ticket.quantity_sold / ticket.quantity_total) * 100}%`,
                    backgroundColor: isSoldOut ? Colors.error : Colors.ticket,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Quantity Selector */}
        {isAvailable && onQuantityChange && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, selectedQuantity <= 0 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(-1)}
                disabled={selectedQuantity <= 0}
              >
                <Ionicons name="remove" size={20} color={Colors.text} />
              </TouchableOpacity>
              
              <Text style={styles.quantityValue}>{selectedQuantity}</Text>
              
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  (selectedQuantity >= availableTickets || selectedQuantity >= maxQuantityPerUser) && styles.quantityButtonDisabled
                ]}
                onPress={() => handleQuantityChange(1)}
                disabled={selectedQuantity >= availableTickets || selectedQuantity >= maxQuantityPerUser}
              >
                <Ionicons name="add" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            isSoldOut && styles.actionButtonDisabled,
            isSelected && styles.actionButtonSelected,
          ]}
          onPress={handleSelectTicket}
          disabled={isSoldOut || isLoading}
        >
          <LinearGradient
            colors={
              isSoldOut
                ? [Colors.textSecondary, Colors.textSecondary]
                : isSelected
                ? [Colors.success, Colors.success]
                : [Colors.ticket, Colors.secondary]
            }
            style={styles.actionButtonGradient}
          >
            <Ionicons
              name={
                isSoldOut
                  ? 'close-circle'
                  : isSelected
                  ? 'checkmark-circle'
                  : 'add-circle'
              }
              size={20}
              color={Colors.surface}
            />
            <Text style={styles.actionButtonText}>
              {isSoldOut
                ? 'Sold Out'
                : isSelected
                ? `${selectedQuantity} Selected`
                : 'Select Tickets'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  containerSelected: {
    transform: [{ scale: 1.02 }],
  },
  containerDisabled: {
    opacity: 0.6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  ticketInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  ticketType: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
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
  priceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  price: {
    fontSize: Typography.fontSize['3xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.ticket,
  },
  priceLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  benefitsContainer: {
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text,
    flex: 1,
  },
  moreBenefits: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.ticket,
    marginTop: Spacing.xs,
  },
  availabilityContainer: {
    marginBottom: Spacing.lg,
  },
  availabilityInfo: {
    gap: Spacing.sm,
  },
  availabilityText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  quantityLabel: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValue: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginHorizontal: Spacing.lg,
    minWidth: 30,
    textAlign: 'center',
  },
  actionButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.success,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.surface,
  },
  disabledText: {
    opacity: 0.5,
  },

  // Compact variant styles
  compactContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  compactContainerSelected: {
    borderColor: Colors.ticket,
    borderWidth: 2,
  },
  compactContainerDisabled: {
    opacity: 0.6,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  compactType: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
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
  compactPrice: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.ticket,
    marginBottom: Spacing.xs,
  },
  compactAvailability: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  quantityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.ticket,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
});