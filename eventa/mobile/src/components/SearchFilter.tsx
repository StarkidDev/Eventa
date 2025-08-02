import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedType: 'all' | 'vote' | 'ticket';
  onTypeChange: (type: 'all' | 'vote' | 'ticket') => void;
  selectedStatus: 'all' | 'upcoming' | 'live' | 'ended';
  onStatusChange: (status: 'all' | 'upcoming' | 'live' | 'ended') => void;
}

const CATEGORIES = [
  'Music',
  'Sports',
  'Technology',
  'Business',
  'Entertainment',
  'Politics',
  'Education',
  'Health',
  'Arts',
  'Food',
  'Fashion',
  'Travel',
];

const EVENT_TYPES = [
  { key: 'all', label: 'All Events', icon: 'grid-outline' },
  { key: 'vote', label: 'Voting Events', icon: 'heart-outline' },
  { key: 'ticket', label: 'Ticket Events', icon: 'ticket-outline' },
] as const;

const EVENT_STATUS = [
  { key: 'all', label: 'All Status', icon: 'time-outline' },
  { key: 'upcoming', label: 'Upcoming', icon: 'calendar-outline' },
  { key: 'live', label: 'Live Now', icon: 'radio-outline' },
  { key: 'ended', label: 'Ended', icon: 'checkmark-circle-outline' },
] as const;

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    selectedCategory !== null,
    selectedType !== 'all',
    selectedStatus !== 'all',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onCategoryChange(null);
    onTypeChange('all');
    onStatusChange('all');
    setShowFilters(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={onSearchChange}
          leftIcon="search-outline"
          style={styles.searchInput}
          containerStyle={styles.searchInputContainer}
        />
        
        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? Colors.surface : Colors.textSecondary}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickFilters}
      >
        {EVENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.quickFilterChip,
              selectedType === type.key && styles.quickFilterChipActive,
            ]}
            onPress={() => onTypeChange(type.key)}
          >
            <Ionicons
              name={type.icon}
              size={16}
              color={selectedType === type.key ? Colors.surface : Colors.primary}
            />
            <Text
              style={[
                styles.quickFilterText,
                selectedType === type.key && styles.quickFilterTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Event Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Event Type</Text>
              <View style={styles.optionsGrid}>
                {EVENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.optionCard,
                      selectedType === type.key && styles.optionCardSelected,
                    ]}
                    onPress={() => onTypeChange(type.key)}
                  >
                    <Ionicons
                      name={type.icon}
                      size={24}
                      color={selectedType === type.key ? Colors.surface : Colors.primary}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selectedType === type.key && styles.optionTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Event Status</Text>
              <View style={styles.optionsGrid}>
                {EVENT_STATUS.map((status) => (
                  <TouchableOpacity
                    key={status.key}
                    style={[
                      styles.optionCard,
                      selectedStatus === status.key && styles.optionCardSelected,
                    ]}
                    onPress={() => onStatusChange(status.key)}
                  >
                    <Ionicons
                      name={status.icon}
                      size={24}
                      color={selectedStatus === status.key ? Colors.surface : Colors.primary}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selectedStatus === status.key && styles.optionTextSelected,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    selectedCategory === null && styles.categoryChipSelected,
                  ]}
                  onPress={() => onCategoryChange(null)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === null && styles.categoryTextSelected,
                    ]}
                  >
                    All Categories
                  </Text>
                </TouchableOpacity>
                
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipSelected,
                    ]}
                    onPress={() => onCategoryChange(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category && styles.categoryTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Apply Filters"
              onPress={() => setShowFilters(false)}
              fullWidth
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  searchInput: {
    backgroundColor: Colors.background,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  quickFilters: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  quickFilterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickFilterText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  quickFilterTextActive: {
    color: Colors.surface,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  clearButton: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  filterSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionCard: {
    width: '48%',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.surface,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text,
  },
  categoryTextSelected: {
    color: Colors.surface,
  },
  modalFooter: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});