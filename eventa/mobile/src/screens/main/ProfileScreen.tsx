import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Button } from '../../components/Button';
import { QRTicket } from '../../components/QRTicket';
import { authService, ticketService, votingService } from '../../services/supabase';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    totalTickets: 0,
    upcomingEvents: 0,
    totalVotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const userProfile = await authService.getUserProfile();
      setUser(userProfile);

      // Load recent tickets (last 3)
      const tickets = await ticketService.getUserTickets();
      setRecentTickets(tickets.slice(0, 3));

      // Load user votes
      const votes = await votingService.getUserVotes();

      // Calculate stats
      const now = new Date();
      const upcomingEvents = tickets.filter((ticket: any) => 
        ticket.event?.start_date && new Date(ticket.event.start_date) > now
      ).length;

      setUserStats({
        totalTickets: tickets.length,
        upcomingEvents,
        totalVotes: votes.length,
      });
    } catch (error: any) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleViewAllTickets = () => {
    navigation.navigate('MyTickets');
  };

  const handleViewVotingHistory = () => {
    Alert.alert('Voting History', 'Voting history feature coming soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings page coming soon!');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@eventa.com');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.signOut();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.profile_pic ? (
              <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={Colors.surface} />
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role?.toUpperCase() || 'VOTER'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{userStats.totalTickets}</Text>
        <Text style={styles.statLabel}>Tickets</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{userStats.upcomingEvents}</Text>
        <Text style={styles.statLabel}>Upcoming</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{userStats.totalVotes}</Text>
        <Text style={styles.statLabel}>Votes Cast</Text>
      </View>
    </View>
  );

  const renderRecentTickets = () => {
    if (recentTickets.length === 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Tickets</Text>
          </View>
          <View style={styles.emptyTickets}>
            <Ionicons name="ticket-outline" size={40} color={Colors.textSecondary} />
            <Text style={styles.emptyTicketsText}>No tickets yet</Text>
            <Button
              title="Browse Events"
              onPress={() => navigation.navigate('TicketEvents')}
              size="small"
              style={styles.browseButton}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tickets</Text>
          <TouchableOpacity onPress={handleViewAllTickets}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentTickets.map((ticket) => (
          <QRTicket
            key={ticket.id}
            purchase={ticket}
            variant="compact"
            showQR={false}
            onPress={() => navigation.navigate('TicketDetail', { ticketId: ticket.id })}
          />
        ))}
      </View>
    );
  };

  const renderMenuItems = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account</Text>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleViewAllTickets}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="ticket-outline" size={24} color={Colors.primary} />
            <Text style={styles.menuItemText}>My Tickets</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleViewVotingHistory}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="heart-outline" size={24} color={Colors.vote} />
            <Text style={styles.menuItemText}>Voting History</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderStats()}
        {renderRecentTickets()}
        {renderMenuItems()}
        
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            icon={<Ionicons name="log-out-outline" size={20} color={Colors.error} />}
            textStyle={{ color: Colors.error }}
          />
        </View>

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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.surface,
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  roleText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.surface,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  viewAllText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  emptyTickets: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTicketsText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  browseButton: {
    minWidth: 120,
  },
  menuContainer: {
    gap: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemText: {
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text,
  },
  logoutSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});