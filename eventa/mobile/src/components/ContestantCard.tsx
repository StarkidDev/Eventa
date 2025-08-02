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

interface Contestant {
  id: string;
  name: string;
  bio?: string;
  media_url?: string;
  code: string;
  vote_count?: number;
  ranking?: number;
}

interface ContestantCardProps {
  contestant: Contestant;
  onVote: (contestantId: string) => void;
  onPress?: (contestant: Contestant) => void;
  canVote?: boolean;
  showVoteCount?: boolean;
  totalVotes?: number;
  variant?: 'default' | 'compact' | 'leaderboard';
  isLoading?: boolean;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  onVote,
  onPress,
  canVote = true,
  showVoteCount = false,
  totalVotes = 0,
  variant = 'default',
  isLoading = false,
}) => {
  const votePercentage = totalVotes > 0 && contestant.vote_count ? 
    (contestant.vote_count / totalVotes) * 100 : 0;

  const handleVotePress = (e: any) => {
    e.stopPropagation();
    if (canVote && !isLoading) {
      onVote(contestant.id);
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(contestant);
    }
  };

  const renderRankingBadge = () => {
    if (!contestant.ranking || variant !== 'leaderboard') return null;
    
    let badgeColor = Colors.textSecondary;
    let icon = null;
    
    if (contestant.ranking === 1) {
      badgeColor = '#FFD700'; // Gold
      icon = 'trophy';
    } else if (contestant.ranking === 2) {
      badgeColor = '#C0C0C0'; // Silver
      icon = 'medal';
    } else if (contestant.ranking === 3) {
      badgeColor = '#CD7F32'; // Bronze
      icon = 'medal';
    }

    return (
      <View style={[styles.rankingBadge, { backgroundColor: badgeColor }]}>
        {icon ? (
          <Ionicons name={icon} size={16} color={Colors.surface} />
        ) : (
          <Text style={styles.rankingText}>#{contestant.ranking}</Text>
        )}
      </View>
    );
  };

  const renderVoteProgress = () => {
    if (!showVoteCount) return null;

    return (
      <View style={styles.voteProgress}>
        <View style={styles.progressInfo}>
          <Text style={styles.voteCount}>
            {contestant.vote_count?.toLocaleString() || 0} votes
          </Text>
          <Text style={styles.votePercentage}>
            {votePercentage.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(votePercentage, 100)}%` }
            ]} 
          />
        </View>
      </View>
    );
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={handleCardPress}
        activeOpacity={0.9}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactImageContainer}>
            {contestant.media_url ? (
              <Image source={{ uri: contestant.media_url }} style={styles.compactImage} />
            ) : (
              <View style={styles.compactImagePlaceholder}>
                <Ionicons name="person" size={20} color={Colors.textSecondary} />
              </View>
            )}
            {renderRankingBadge()}
          </View>
          
          <View style={styles.compactInfo}>
            <Text style={styles.compactName} numberOfLines={1}>
              {contestant.name}
            </Text>
            <Text style={styles.compactCode}>#{contestant.code}</Text>
            {showVoteCount && (
              <Text style={styles.compactVotes}>
                {contestant.vote_count?.toLocaleString() || 0} votes
              </Text>
            )}
          </View>
          
          {canVote && (
            <TouchableOpacity
              style={styles.compactVoteButton}
              onPress={handleVotePress}
              disabled={isLoading}
            >
              <Ionicons 
                name="heart" 
                size={16} 
                color={isLoading ? Colors.textSecondary : Colors.vote} 
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, variant === 'leaderboard' && styles.leaderboardContainer]}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Contestant Image */}
        <View style={styles.imageContainer}>
          {contestant.media_url ? (
            <Image source={{ uri: contestant.media_url }} style={styles.image} />
          ) : (
            <LinearGradient
              colors={[Colors.vote, Colors.primary]}
              style={styles.imagePlaceholder}
            >
              <Ionicons name="person" size={40} color={Colors.surface} />
            </LinearGradient>
          )}
          
          {renderRankingBadge()}
          
          {/* Contest Code */}
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>#{contestant.code}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>
              {contestant.name}
            </Text>
            {contestant.bio && (
              <Text style={styles.bio} numberOfLines={3}>
                {contestant.bio}
              </Text>
            )}
          </View>

          {renderVoteProgress()}

          {/* Vote Button */}
          {canVote && (
            <TouchableOpacity
              style={[styles.voteButton, isLoading && styles.voteButtonDisabled]}
              onPress={handleVotePress}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? [Colors.textSecondary, Colors.textSecondary] : [Colors.vote, Colors.primary]}
                style={styles.voteButtonGradient}
              >
                <Ionicons 
                  name="heart" 
                  size={20} 
                  color={Colors.surface} 
                />
                <Text style={styles.voteButtonText}>
                  {isLoading ? 'Voting...' : 'Vote Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
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
  leaderboardContainer: {
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
  rankingBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  codeBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  codeText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.vote,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bio: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  voteProgress: {
    marginBottom: Spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  voteCount: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
  },
  votePercentage: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.vote,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.vote,
    borderRadius: 4,
  },
  voteButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  voteButtonDisabled: {
    opacity: 0.6,
  },
  voteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  voteButtonText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.surface,
  },
  
  // Compact variant styles
  compactContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  compactImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  compactImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  compactCode: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.vote,
  },
  compactVotes: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  compactVoteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});