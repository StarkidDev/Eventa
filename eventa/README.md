# Eventa

A comprehensive event discovery, ticketing, and digital voting platform built with React Native and Next.js.

## 🚀 Project Overview

Eventa is a hybrid mobile-first platform that combines:
- **Event Discovery & Ticketing** for concerts, festivals, and conferences
- **Digital Voting** for competitions, elections, or audience polls (via app or USSD)

### Target Users
- **Attendees/Voters**: Discover events, vote, and purchase tickets
- **Organizers**: Create and manage events, track analytics
- **Platform Admins**: Oversee the platform, approve organizers, monitor activity

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native (Mobile), React/Next.js (Web Dashboard)
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Realtime & Communications**: Supabase Realtime, OneSignal, EmailJS, USSD APIs
- **Payments**: Stripe, Flutterwave, Mobile Money Integration
- **Database**: PostgreSQL with Row Level Security (RLS)

### Project Structure
```
eventa/
├── mobile/          # React Native mobile app
├── web/             # Next.js web dashboard
├── shared/          # Shared types, utilities, and configuration
└── README.md
```

## 📱 Features

### Mobile App (React Native) ✅ IMPLEMENTED
- **Authentication**: Email, social login, OTP verification
- **Event Discovery**: Browse voting and ticketed events with search & filters
- **Voting System**: In-app voting with real-time results and leaderboards
- **Event Feed**: Beautiful card-based UI with distinct voting/ticket sections
- **User Profiles**: Manage settings and view history

### Web Dashboard (Next.js) 🔄 IN PROGRESS
- **Organizer Dashboard**: Create and manage events
- **Admin Panel**: Platform oversight and analytics
- **Event Management**: Add contestants, set ticket types
- **Analytics**: View voting stats, ticket sales, performance metrics

## 🎨 Design System

### Color Scheme
- **Primary**: #6C5CE7 (Violet)
- **Secondary**: #00CEC9 (Teal) 
- **Accent**: #FDCB6E (Yellow)
- **Background**: #F8F9FA
- **Text**: #2D3436

### Typography
- **Font Family**: Inter
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)

## ✨ Current Features (Phase 2 Complete!)

### 🔐 Authentication System
- Beautiful gradient login/signup screens
- Role-based registration (Voter vs Organizer)
- JWT-based auth with Supabase
- Profile management

### 📊 Event Discovery Feed
- **Advanced Search & Filtering**: Real-time search with category, status, and type filters
- **Beautiful Event Cards**: Dynamic cards showing event status, pricing, and availability
- **Tab-Based Navigation**: Separate sections for voting events and ticket events
- **Pull-to-Refresh**: Real-time data updates
- **Infinite Scroll**: Pagination for large event lists

### ✨ Voting System
- **Live Voting Interface**: Beautiful contestant cards with voting buttons
- **Real-Time Results**: Live leaderboards with vote percentages and rankings
- **Contest Status**: Live/Upcoming/Ended indicators
- **Vote Statistics**: Total votes, contestant rankings, method tracking
- **Interactive UI**: Smooth animations and loading states

### 🎯 Smart UI Components
- **EventCard**: Displays events with status badges, pricing, and CTAs
- **ContestantCard**: Multiple variants (default, compact, leaderboard)
- **SearchFilter**: Advanced filtering with modal interface
- **Custom Hooks**: `useEvents` for efficient data management

## 🛠️ Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- Expo CLI
- Supabase account
- Stripe account (for payments)

### 1. Clone and Install
```bash
git clone <repository-url>
cd eventa
npm install
```

### 2. Install Mobile Dependencies
```bash
cd mobile
npm install --legacy-peer-deps
```

### 3. Install Web Dependencies
```bash
cd ../web
npm install
```

### 4. Environment Configuration

#### Mobile App (.env)
```bash
cd mobile
cp .env.example .env
```

Update with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-flutterwave-key
```

### 5. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `shared/config/database.sql`
3. Configure Row Level Security policies
4. Set up authentication providers

### 6. Start Development

#### Mobile App
```bash
cd mobile
npm run start
```

#### Web Dashboard
```bash
cd web
npm run dev
```

## 📊 Database Schema

### Core Tables ✅ IMPLEMENTED
- **users**: User profiles and authentication
- **events**: Event information (voting or ticketing)
- **contestants**: Voting event participants
- **votes**: User votes with method tracking
- **tickets**: Ticket types and pricing
- **purchases**: Ticket purchases with QR codes
- **check_ins**: Event check-in tracking

### Key Features
- **Row Level Security (RLS)**: Secure data access
- **Real-time subscriptions**: Live vote updates
- **Audit logging**: Track all user actions
- **Performance indexes**: Optimized queries
- **Vote statistics function**: Real-time leaderboards

## 🔐 Authentication & Authorization

### User Roles
- **Voter**: Can vote and purchase tickets
- **Organizer**: Can create and manage events (requires approval)
- **Admin**: Full platform access

### Security Features
- JWT-based authentication via Supabase
- Row Level Security for data isolation
- Email verification required
- Organizer verification process

## 🎯 Development Phases

### Phase 1 - MVP ✅ COMPLETED
- ✅ Project setup and architecture
- ✅ Authentication system
- ✅ Basic UI components and navigation
- ✅ Database schema and security

### Phase 2 - Core Features ✅ COMPLETED
- ✅ Event discovery and search functionality
- ✅ Voting system with live results
- ✅ Beautiful UI components and interactions
- ✅ Real-time vote tracking
- ✅ Advanced filtering and search

### Phase 3 - Payment & Tickets 🔄 IN PROGRESS
- 🔄 Ticket purchase flow with QR codes
- 🔄 Payment integration (Stripe, Flutterwave)
- 🔄 QR code scanning for check-ins
- 🔄 Organizer dashboard

### Phase 4 - Admin & Analytics 📋 PLANNED
- Admin panel and oversight
- Analytics and reporting
- Performance optimization
- USSD integration

## 🚀 Deployment

### Mobile App
- **iOS**: App Store via Expo EAS Build
- **Android**: Google Play Store via Expo EAS Build

### Web Dashboard
- **Platform**: Vercel or Netlify
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Integrated with hosting platform

## 🎉 Latest Updates (Phase 2)

### 🆕 New Features Added
1. **Advanced Event Discovery**
   - Smart search with debouncing
   - Multi-criteria filtering (type, category, status)
   - Beautiful card-based layout
   - Pull-to-refresh and infinite scroll

2. **Complete Voting System**
   - Live voting with instant feedback
   - Real-time leaderboards with rankings
   - Vote progress bars and statistics
   - Beautiful contestant profiles

3. **Enhanced Navigation**
   - Dedicated screens for voting and ticket events
   - Tab-based interface with badges
   - Smooth animations and transitions

4. **Professional UI Components**
   - Reusable EventCard and ContestantCard
   - Advanced SearchFilter with modal
   - Loading states and error handling
   - Responsive design patterns

### 🔧 Technical Improvements
- Custom hooks for state management
- Optimized API calls with pagination
- Type-safe database operations
- Real-time subscriptions ready
- Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🎉 Acknowledgments

- Supabase team for the amazing backend platform
- Expo team for React Native development tools
- Open source community for the libraries used

---

**Status**: Phase 2 Complete! 🚀 
Ready for ticket purchasing system and organizer dashboard implementation.