'use client'

import { useState, useEffect } from 'react'
import {
  CalendarDaysIcon,
  TicketIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Mock data for demonstration
const statsData = [
  {
    name: 'Total Events',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: CalendarDaysIcon,
    description: 'Active events this month',
  },
  {
    name: 'Tickets Sold',
    value: '1,847',
    change: '+23%',
    changeType: 'positive',
    icon: TicketIcon,
    description: 'Total tickets sold',
  },
  {
    name: 'Total Votes',
    value: '3,291',
    change: '+18%',
    changeType: 'positive',
    icon: UserGroupIcon,
    description: 'Votes cast this month',
  },
  {
    name: 'Revenue',
    value: '$45,210',
    change: '-2%',
    changeType: 'negative',
    icon: CurrencyDollarIcon,
    description: 'Total revenue earned',
  },
]

const chartData = [
  { name: 'Jan', events: 4, tickets: 240, revenue: 2400 },
  { name: 'Feb', events: 6, tickets: 380, revenue: 3800 },
  { name: 'Mar', events: 8, tickets: 520, revenue: 5200 },
  { name: 'Apr', events: 5, tickets: 420, revenue: 4200 },
  { name: 'May', events: 9, tickets: 680, revenue: 6800 },
  { name: 'Jun', events: 7, tickets: 590, revenue: 5900 },
]

const eventTypeData = [
  { name: 'Ticketing', value: 65, color: '#6c5ce7' },
  { name: 'Voting', value: 35, color: '#00cec9' },
]

const recentEvents = [
  {
    id: 1,
    title: 'Summer Music Festival',
    type: 'ticket',
    status: 'live',
    tickets: { sold: 245, total: 500 },
    revenue: '$12,250',
    date: '2024-07-15',
  },
  {
    id: 2,
    title: 'Best Artist 2024',
    type: 'vote',
    status: 'live',
    votes: 1250,
    date: '2024-07-10',
  },
  {
    id: 3,
    title: 'Tech Conference 2024',
    type: 'ticket',
    status: 'upcoming',
    tickets: { sold: 89, total: 200 },
    revenue: '$8,900',
    date: '2024-08-01',
  },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6c5ce7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {eventTypeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentEvents.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ stat }: { stat: any }) {
  const Icon = stat.icon
  const isPositive = stat.changeType === 'positive'

  return (
    <div className="bg-white p-6 rounded-lg shadow card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          <span>{stat.change}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
    </div>
  )
}

function EventRow({ event }: { event: any }) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'live':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'upcoming':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'ended':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-2 h-2 rounded-full ${
            event.type === 'ticket' ? 'bg-primary-500' : 'bg-secondary-500'
          }`} />
          <div>
            <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
            <p className="text-xs text-gray-500">{event.date}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={getStatusBadge(event.status)}>
            {event.status}
          </span>
          
          {event.type === 'ticket' ? (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{event.revenue}</p>
              <p className="text-xs text-gray-500">
                {event.tickets.sold}/{event.tickets.total} sold
              </p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{event.votes} votes</p>
              <p className="text-xs text-gray-500">Total cast</p>
            </div>
          )}
          
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}