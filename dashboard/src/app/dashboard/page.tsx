'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import {
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Video,
  Trophy,
  TrendingUp,
  DollarSign,
  MapPin,
  BarChart3,
} from 'lucide-react';
import StatCard from '@/components/Charts/StatCard';
import ChartCard from '@/components/Charts/ChartCard';
import { formatCurrency } from '@/lib/analytics';
import {
  mockEventsOverTime,
  mockEventsByType,
  mockRevenueOverTime,
  mockInscriptionsByStatus,
  mockTopEvents,
  mockParticipantsByWilaya,
} from '@/lib/mockData';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

export default function DashboardPage() {
  const { admin, isSuperAdmin } = useAuth();
  
  // Hardcoded stats for visualization
  const stats = {
    totalEvents: 228,
    totalParticipants: 6850,
    totalUsers: 7200,
    totalInscriptions: 300,
    activeChats: 12,
    activeLivestreams: 5,
    totalRevenue: 1050000,
    pendingInscriptions: 85,
    approvedInscriptions: 165,
  };

  // Use mock data for all visualizations
  const eventsOverTime = mockEventsOverTime;
  const eventsByType = mockEventsByType;
  const revenueOverTime = mockRevenueOverTime;
  const inscriptionsByStatus = mockInscriptionsByStatus;
  const topEvents = mockTopEvents;
  const participantsByWilaya = mockParticipantsByWilaya;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === 'number' && entry.value > 1000 ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
          {/* Welcome Section with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {admin?.name}! 👋</h2>
                  <p className="text-indigo-100 text-lg">
                    {isSuperAdmin
                      ? 'Manage national events, virtual house, and all participants across Algeria'
                      : 'Manage your youth house events, local activities, and assigned participants'}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="flex gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
                      <div className="text-2xl font-bold">{stats.totalEvents}</div>
                      <div className="text-sm text-indigo-100">Total Events</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <div className="text-sm text-indigo-100">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              subtitle={isSuperAdmin ? 'All events' : 'Local events'}
              icon={Calendar}
              iconColor="text-indigo-600"
            />
            <StatCard
              title="Participants"
              value={stats.totalParticipants}
              subtitle={isSuperAdmin ? 'All participants' : 'House members'}
              icon={Users}
              iconColor="text-blue-600"
            />
            <StatCard
              title="Inscriptions"
              value={stats.totalInscriptions}
              subtitle={`${stats.pendingInscriptions} pending`}
              icon={FileText}
              iconColor="text-green-600"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              subtitle="From completed payments"
              icon={DollarSign}
              iconColor="text-purple-600"
            />
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Active Chats"
              value={stats.activeChats}
              subtitle="Currently active discussions"
              icon={MessageSquare}
              iconColor="text-cyan-600"
            />
            <StatCard
              title="Live Streams"
              value={stats.activeLivestreams}
              subtitle="Currently broadcasting"
              icon={Video}
              iconColor="text-red-600"
            />
            <StatCard
              title="Approved Registrations"
              value={stats.approvedInscriptions}
              subtitle="Ready to attend"
              icon={Trophy}
              iconColor="text-yellow-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events Over Time - Area Chart */}
            <ChartCard
              title="Events Over Time"
              subtitle="Event creation timeline"
              icon={TrendingUp}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={eventsOverTime}>
                  <defs>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={COLORS.primary}
                    fill="url(#colorEvents)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Events by Type - Pie Chart */}
            <ChartCard
              title="Events Distribution"
              subtitle="Events by type breakdown"
              icon={BarChart3}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eventsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Revenue Over Time */}
            <ChartCard
              title="Revenue Trends"
              subtitle="Payment revenue over time"
              icon={DollarSign}
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={revenueOverTime}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="url(#colorRevenue)"
                    stroke={COLORS.success}
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="value" stroke={COLORS.success} strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Inscriptions Status - Donut Chart */}
            <ChartCard
              title="Registration Status"
              subtitle="Event inscriptions breakdown"
              icon={FileText}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inscriptionsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ label, percentage }: any) => `${label}: ${(percentage as number).toFixed(1)}%`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inscriptionsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Top Events by Inscriptions - Bar Chart */}
            <ChartCard
              title="Top Events"
              subtitle="Most popular events by registrations"
              icon={Trophy}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topEvents} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis type="number" className="text-xs" tick={{ fill: '#6b7280' }} />
                  <YAxis
                    dataKey="event.title"
                    type="category"
                    width={150}
                    className="text-xs"
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={COLORS.secondary} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Participants by Wilaya - Bar Chart */}
            <ChartCard
              title="Top Wilayas"
              subtitle="Participant distribution by province"
              icon={MapPin}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={participantsByWilaya}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis className="text-xs" tick={{ fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill={COLORS.info} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/dashboard/events"
                  className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200 group"
                >
                  <Calendar className="h-5 w-5 mr-3 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-900 font-medium">Manage Events & Activities</span>
                </a>
                <a
                  href="/dashboard/participants"
                  className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
                >
                  <Users className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-900 font-medium">View Participants</span>
                </a>
                <a
                  href="/dashboard/leaderboard"
                  className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 group"
                >
                  <Trophy className="h-5 w-5 mr-3 text-yellow-600 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-900 font-medium">View Leaderboard</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Information</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Your Role</p>
                  <p className="font-semibold text-gray-900">
                    {isSuperAdmin ? 'Super Admin' : 'Youth House Director'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Access Level</p>
                  <p className="font-semibold text-gray-900">
                    {isSuperAdmin ? 'National & Virtual House' : 'Local Youth House'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{admin?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
