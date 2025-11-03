'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { apiService } from '@/lib/api';
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
import {
  formatCurrency,
  processEventsOverTime,
  processEventsByType,
  processRevenueOverTime,
  processInscriptionsByStatus,
  processParticipantsByWilaya,
  getTopEventsByInscriptions,
} from '@/lib/analytics';
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalUsers: 0,
    totalInscriptions: 0,
    activeChats: 0,
    activeLivestreams: 0,
    totalRevenue: 0,
    pendingInscriptions: 0,
    approvedInscriptions: 0,
  });

  const [events, setEvents] = useState<any[]>([]);
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [livestreams, setLivestreams] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [isSuperAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        eventsResponse,
        inscriptionsResponse,
        paymentsResponse,
        chatsResponse,
        livestreamsResponse,
        usersResponse,
        participantsResponse,
      ] = await Promise.all([
        apiService.getEvents(),
        apiService.getEventInscriptions(),
        apiService.getPayments(),
        apiService.getChats(),
        apiService.getLivestreams(),
        apiService.getUsers(),
        apiService.getParticipants(),
      ]);

      // Set data
      if (eventsResponse.success && eventsResponse.data) {
        setEvents(eventsResponse.data.events || []);
      }

      if (inscriptionsResponse.success && inscriptionsResponse.data) {
        setInscriptions(inscriptionsResponse.data.inscriptions || []);
      }

      if (paymentsResponse.success && paymentsResponse.data) {
        setPayments(paymentsResponse.data.payments || []);
      }

      if (chatsResponse.success && chatsResponse.data) {
        setChats(chatsResponse.data.chats || []);
      }

      if (livestreamsResponse.success && livestreamsResponse.data) {
        setLivestreams(livestreamsResponse.data.livestreams || []);
      }

      if (usersResponse.success && usersResponse.data) {
        setAllUsers(usersResponse.data.users || []);
      }

      if (participantsResponse.success && participantsResponse.data) {
        setParticipants(participantsResponse.data.participants || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  useEffect(() => {
    const completedPayments = payments.filter((p) => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => {
      const amount = typeof p.amount === 'number' ? p.amount : parseFloat(p.amount) || 0;
      return sum + amount;
    }, 0);

    const pendingInscriptions = inscriptions.filter((i) => i.status === 'pending').length;
    const approvedInscriptions = inscriptions.filter((i) => i.status === 'approved').length;
    const activeChats = chats.filter((c) => c.is_active).length;
    const activeLivestreams = livestreams.filter((l) => l.is_live).length;

    setStats({
      totalEvents: events.length,
      totalParticipants: participants.length,
      totalUsers: allUsers.length,
      totalInscriptions: inscriptions.length,
      activeChats,
      activeLivestreams,
      totalRevenue,
      pendingInscriptions,
      approvedInscriptions,
    });
  }, [events, inscriptions, payments, chats, livestreams, allUsers, participants]);

  // Process chart data
  const eventsOverTime = processEventsOverTime(events);
  const eventsByType = processEventsByType(events);
  const revenueOverTime = processRevenueOverTime(payments);
  const inscriptionsByStatus = processInscriptionsByStatus(inscriptions);
  const topEvents = getTopEventsByInscriptions(events, inscriptions);
  const participantsByWilaya = processParticipantsByWilaya(participants);

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

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
          {/* Stats Cards */}
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

            {/* Top Events by Inscriptions - Bar Chart */}
            {topEvents.length > 0 && (
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
            )}

            {/* Participants by Wilaya - Bar Chart */}
            {participantsByWilaya.length > 0 && (
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
            )}

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
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
