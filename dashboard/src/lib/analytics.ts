import { Event, EventInscription, Payment, Participant, User } from './api';

/**
 * Analytics utility functions for processing dashboard data
 */

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
  [key: string]: string | number | undefined;
}

export interface DistributionData {
  label: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number | undefined;
}

/**
 * Process events into time series data
 */
export function processEventsOverTime(events: Event[]): TimeSeriesData[] {
  const grouped = events.reduce((acc, event) => {
    const date = new Date(event.date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Process events by type distribution
 */
export function processEventsByType(events: Event[], t?: (key: string) => string): ChartDataPoint[] {
  const types = ['national', 'local', 'online', 'hybrid'];
  const colors = {
    national: '#8b5cf6',
    local: '#3b82f6',
    online: '#10b981',
    hybrid: '#f59e0b',
  };

  const distribution = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return types.map((type) => ({
    name: t ? t(`events.${type}`) : type.charAt(0).toUpperCase() + type.slice(1),
    value: distribution[type] || 0,
    fill: colors[type as keyof typeof colors],
  }));
}

/**
 * Process inscriptions by status
 */
export function processInscriptionsByStatus(inscriptions: EventInscription[], t?: (key: string) => string): DistributionData[] {
  const statusColors = {
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    attended: '#3b82f6',
  };

  const distribution = inscriptions.reduce((acc, ins) => {
    acc[ins.status] = (acc[ins.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = inscriptions.length;
  return Object.entries(distribution).map(([status, value]) => ({
    label: t ? t(`common.${status}`) : status.charAt(0).toUpperCase() + status.slice(1),
    value,
    percentage: total > 0 ? (value / total) * 100 : 0,
    color: statusColors[status as keyof typeof statusColors] || '#6b7280',
  }));
}

/**
 * Process payments by status
 */
export function processPaymentsByStatus(payments: Payment[]): DistributionData[] {
  const statusColors = {
    pending: '#f59e0b',
    completed: '#10b981',
    failed: '#ef4444',
    refunded: '#f97316',
  };

  const distribution = payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = payments.length;
  return Object.entries(distribution).map(([status, value]) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    percentage: total > 0 ? (value / total) * 100 : 0,
    color: statusColors[status as keyof typeof statusColors] || '#6b7280',
  }));
}

/**
 * Process revenue over time
 */
export function processRevenueOverTime(payments: Payment[]): TimeSeriesData[] {
  const completedPayments = payments.filter((p) => p.status === 'completed');
  const grouped = completedPayments.reduce((acc, payment) => {
    const date = payment.paid_at
      ? new Date(payment.paid_at).toISOString().split('T')[0]
      : new Date(payment.created_at).toISOString().split('T')[0];
    const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, value: Number(value.toFixed(2)) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Process participants by wilaya
 */
export function processParticipantsByWilaya(participants: Participant[]): ChartDataPoint[] {
  const distribution = participants.reduce((acc, participant) => {
    const wilaya = participant.wilaya || 'Unknown';
    acc[wilaya] = (acc[wilaya] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(distribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 wilayas
    .map(([wilaya, value]) => ({
      name: wilaya,
      value,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color for each wilaya
    }));
}

/**
 * Process event attendance trends
 */
export function processAttendanceTrends(inscriptions: EventInscription[]): TimeSeriesData[] {
  const attended = inscriptions.filter((ins) => ins.status === 'attended');
  const grouped = attended.reduce((acc, ins) => {
    const date = new Date(ins.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get top events by inscriptions
 */
export function getTopEventsByInscriptions(
  events: Event[],
  inscriptions: EventInscription[]
): Array<{ event: Event; count: number }> {
  const eventCounts = inscriptions.reduce((acc, ins) => {
    acc[ins.event_id] = (acc[ins.event_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return events
    .map((event) => ({
      event,
      count: eventCounts[event.id] || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * Calculate growth percentage
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get last N days for time series
 */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

