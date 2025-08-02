import Link from 'next/link'
import { CalendarDaysIcon, TicketIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Eventa</h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/auth/login" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Manage Events Like a
            <span className="block text-accent-400">Professional</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Create, manage, and analyze your events with our comprehensive dashboard. 
            Handle ticketing, voting events, and track performance all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register" 
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Managing Events
            </Link>
            <Link 
              href="/demo" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<CalendarDaysIcon className="h-8 w-8" />}
            title="Event Management"
            description="Create and manage both ticketing and voting events with ease"
          />
          <FeatureCard
            icon={<TicketIcon className="h-8 w-8" />}
            title="Ticketing System"
            description="Handle ticket sales, QR codes, and check-ins seamlessly"
          />
          <FeatureCard
            icon={<UserGroupIcon className="h-8 w-8" />}
            title="Voting Platform"
            description="Organize digital voting with real-time results and analytics"
          />
          <FeatureCard
            icon={<ChartBarIcon className="h-8 w-8" />}
            title="Analytics"
            description="Track performance with detailed insights and reports"
          />
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Powerful Dashboard
            </h2>
            <p className="text-gray-200 text-lg">
              Everything you need to manage successful events
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Total Events"
                value="24"
                change="+12%"
                positive={true}
              />
              <DashboardCard 
                title="Tickets Sold"
                value="1,847"
                change="+23%"
                positive={true}
              />
              <DashboardCard 
                title="Revenue"
                value="$45,210"
                change="+18%"
                positive={true}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
      <div className="text-white mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-200">{description}</p>
    </div>
  )
}

function DashboardCard({ title, value, change, positive }: {
  title: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
    </div>
  )
}
