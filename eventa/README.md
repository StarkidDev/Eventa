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

### Mobile App (React Native)
- **Authentication**: Email, social login, OTP verification
- **Event Discovery**: Browse voting and ticketed events
- **Voting System**: In-app voting with real-time results
- **Ticket Purchase**: Secure payment flow with QR code generation
- **User Profiles**: Manage settings and view history

### Web Dashboard (Next.js)
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

#### Web Dashboard
```bash
cd ../web
# Copy and configure environment variables
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

### Core Tables
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

### Phase 1 - MVP (Current)
- ✅ Project setup and architecture
- ✅ Authentication system
- ✅ Basic UI components and navigation
- 🔄 Event discovery and feed
- 🔄 Voting system implementation
- 🔄 Ticket purchase flow

### Phase 2 - Core Features
- Organizer dashboard
- Event creation and management
- Payment integration
- QR code system

### Phase 3 - Advanced Features
- Admin panel
- Analytics and reporting
- Real-time notifications
- USSD integration

### Phase 4 - Production
- Performance optimization
- Security hardening
- Deployment and monitoring
- User feedback integration

## 🚀 Deployment

### Mobile App
- **iOS**: App Store via Expo EAS Build
- **Android**: Google Play Store via Expo EAS Build

### Web Dashboard
- **Platform**: Vercel or Netlify
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Integrated with hosting platform

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