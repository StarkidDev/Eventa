'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  TicketIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

interface Event {
  id: string
  title: string
  type: 'ticket' | 'vote'
  status: 'draft' | 'published' | 'live' | 'ended'
  category: string
  startDate: string
  endDate: string
  location: string
  ticketsSold?: number
  totalTickets?: number
  totalVotes?: number
  revenue?: number
  createdAt: string
  updatedAt: string
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    type: 'ticket',
    status: 'live',
    category: 'Music',
    startDate: '2024-07-15T18:00:00Z',
    endDate: '2024-07-17T23:00:00Z',
    location: 'Central Park, NY',
    ticketsSold: 245,
    totalTickets: 500,
    revenue: 12250,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-07-10T15:30:00Z',
  },
  {
    id: '2',
    title: 'Best Artist 2024 Voting',
    type: 'vote',
    status: 'live',
    category: 'Entertainment',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-31T23:59:59Z',
    location: 'Online',
    totalVotes: 1250,
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-07-12T11:20:00Z',
  },
  {
    id: '3',
    title: 'Tech Conference 2024',
    type: 'ticket',
    status: 'published',
    category: 'Technology',
    startDate: '2024-08-01T09:00:00Z',
    endDate: '2024-08-03T17:00:00Z',
    location: 'Convention Center, SF',
    ticketsSold: 89,
    totalTickets: 200,
    revenue: 8900,
    createdAt: '2024-05-20T14:00:00Z',
    updatedAt: '2024-07-05T16:45:00Z',
  },
  {
    id: '4',
    title: 'Community Art Awards',
    type: 'vote',
    status: 'ended',
    category: 'Arts',
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-05-31T23:59:59Z',
    location: 'Online',
    totalVotes: 892,
    createdAt: '2024-04-15T08:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
  },
]

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    const matchesType = typeFilter === 'all' || event.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`
      case 'published':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'live':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'ended':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (type) {
      case 'ticket':
        return `${baseClasses} bg-primary-100 text-primary-800`
      case 'vote':
        return `${baseClasses} bg-secondary-100 text-secondary-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage your events and track their performance</p>
        </div>
        <Link
          href="/dashboard/events/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Live Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'live').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0)}
              </p>
            </div>
            <TicketIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + (e.totalVotes || 0), 0)}
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-secondary-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="ticket">Ticketing</option>
            <option value="vote">Voting</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.category} • {event.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={getTypeBadge(event.type)}>
                        {event.type === 'ticket' ? 'Ticketing' : 'Voting'}
                      </span>
                      <br />
                      <span className={getStatusBadge(event.status)}>
                        {event.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Start: {formatDate(event.startDate)}</div>
                      <div>End: {formatDate(event.endDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.type === 'ticket' ? (
                      <div>
                        <div className="font-medium">${event.revenue?.toLocaleString()}</div>
                        <div className="text-gray-500">
                          {event.ticketsSold}/{event.totalTickets} sold
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{event.totalVotes?.toLocaleString()} votes</div>
                        <div className="text-gray-500">Total cast</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first event.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Create Event
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}