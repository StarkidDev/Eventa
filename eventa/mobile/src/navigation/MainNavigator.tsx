import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/main/HomeScreen';
import { VotingEventsScreen } from '../screens/main/VotingEventsScreen';
import { TicketEventsScreen } from '../screens/main/TicketEventsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { Colors, Layout } from '../constants/theme';

export type MainTabParamList = {
  Home: undefined;
  VotingEvents: undefined;
  TicketEvents: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'VotingEvents':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'TicketEvents':
              iconName = focused ? 'ticket' : 'ticket-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: Layout.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
          borderBottomColor: Colors.border,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="VotingEvents" 
        component={VotingEventsScreen}
        options={{ title: '✨ Voting' }}
      />
      <Tab.Screen 
        name="TicketEvents" 
        component={TicketEventsScreen}
        options={{ title: '🎟️ Events' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};