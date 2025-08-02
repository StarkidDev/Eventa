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
import { ContestantCard } from '../../components/ContestantCard';
import { eventService, votingService } from '../../services/supabase';

const { width, height } = Dimensions.get('window');

interface VotingEventDetailScreenProps {
  navigation: any;
  route: {
    params: {
      eventId: string;
    };
  };
}

export const VotingEventDetailScreen: React.FC<VotingEventDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { eventId } = route.params;
  
  const [event, setEvent] = useState<any>(null);
  const [voteStats, setVoteStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [votingLoading, setVotingLoading] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'contestants' | 'leaderboard'>('contestants');

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      const [eventData, statsData] = await Promise.all([
        eventService.getEvent(eventId),
        eventService.getVoteStats(eventId),
      ]);
      
      setEvent(eventData);
      setVoteStats(statsData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load event data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleVote = async (contestantId: string) => {
    try {
      setVotingLoading(contestantId);
      await votingService.vote(eventId, contestantId);
      
      // Refresh vote stats after voting
      const updatedStats = await eventService.getVoteStats(eventId);
      setVoteStats(updatedStats);
      
      Alert.alert('Vote Cast!', 'Your vote has been recorded successfully.');
    } catch (error: any) {
      Alert.alert('Voting Failed', error.message || 'Unable to cast vote');
    } finally {
      setVotingLoading(null);
    }
  };

  const handleContestantPress = (contestant: any) => {
    Alert.alert(
      contestant.name,
      contestant.bio || 'Vote for this contestant!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Vote Now', 
          onPress: () => handleVote(contestant.id),
          style: 'default'
        },
      ]
    );
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

  const canVote = () => {
    if (!event) return false;
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    return now >= startDate && now <= endDate;
  };

  const getContestantsWithStats = () => {
    if (!event?.contestants || !voteStats?.contestants) return [];
    
    return event.contestants.map((contestant: any) => {
      const stats = voteStats.contestants.find((s: any) => s.contestant_id === contestant.id);
      return {
        ...contestant,
        vote_count: stats?.vote_count || 0,
        ranking: getContestantRanking(contestant.id),
      };
    }).sort((a: any, b: any) => selectedTab === 'leaderboard' ? b.vote_count - a.vote_count : 0);
  };

  const getContestantRanking = (contestantId: string) => {
    if (!voteStats?.contestants) return null;
    
    const sorted = [...voteStats.contestants].sort((a, b) => b.vote_count - a.vote_count);
    return sorted.findIndex(c => c.contestant_id === contestantId) + 1;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Background Image */}
      <View style={styles.headerBackground}>
        {event?.image_url ? (
          <Image source={{ uri: event.image_url }} style={styles.headerImage} />
        ) : (
          <LinearGradient
            colors={[Colors.vote, Colors.primary]}
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
          
          {voteStats && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{voteStats.total_votes?.toLocaleString() || 0}</Text>
                <Text style={styles.statLabel}>Total Votes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{event?.contestants?.length || 0}</Text>
                <Text style={styles.statLabel}>Contestants</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <Button
        title="Contestants"
        onPress={() => setSelectedTab('contestants')}
        variant={selectedTab === 'contestants' ? 'primary' : 'ghost'}
        size="small"
        style={styles.tabButton}
      />
      <Button
        title="Leaderboard"
        onPress={() => setSelectedTab('leaderboard')}
        variant={selectedTab === 'leaderboard' ? 'primary' : 'ghost'}
        size="small"
        style={styles.tabButton}
      />
    </View>
  );

  const renderContestants = () => {
    const contestants = getContestantsWithStats();
    
    if (!contestants.length) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Contestants Yet</Text>
          <Text style={styles.emptyText}>
            Contestants will appear here once they are added by the organizer.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.contestantsContainer}>
        {contestants.map((contestant: any, index: number) => (
          <ContestantCard
            key={contestant.id}
            contestant={contestant}
            onVote={handleVote}
            onPress={handleContestantPress}
            canVote={canVote()}
            showVoteCount={true}
            totalVotes={voteStats?.total_votes || 0}
            variant={selectedTab === 'leaderboard' ? 'leaderboard' : 'default'}
            isLoading={votingLoading === contestant.id}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.vote} />
          <Text style={styles.loadingText}>Loading voting event...</Text>
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
          <Text style={styles.errorText}>This voting event could not be loaded.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
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
            colors={[Colors.vote]}
            tintColor={Colors.vote}
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

        {renderTabBar()}
        {renderContestants()}

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
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.surface,
    opacity: 0.8,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  tabButton: {
    flex: 1,
  },
  contestantsContainer: {
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