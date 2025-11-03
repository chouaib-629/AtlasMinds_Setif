'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, Payment, Event } from '@/lib/api';
import { DollarSign, CheckCircle, XCircle, Clock, RefreshCw, Filter } from 'lucide-react';

export default function PaymentsPage() {
  const { isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    event_id: '',
    status: '',
    start_date: '',
    end_date: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPayments();
    loadEvents();
  }, [filters]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.event_id) params.event_id = parseInt(filters.event_id);
      if (filters.status) params.status = filters.status;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const response = await apiService.getPayments(params);
      if (response.success && response.data) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await apiService.getEvents(
        isSuperAdmin ? {} : { type: 'local', attendance_type: 'in-person' }
      );
      if (response.success && response.data) {
        // Only show events with pricing
        setEvents(response.data.events.filter((e: Event) => e.has_price));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleStatusUpdate = async (paymentId: number, status: 'completed' | 'failed' | 'refunded') => {
    const statusText = status === 'completed' ? t('payments.completed') : status === 'failed' ? t('payments.failed') : t('payments.refunded');
    if (confirm(`${t('payments.confirmStatusUpdate')} ${statusText}?`)) {
      try {
        await apiService.updatePaymentStatus(paymentId, status);
        loadPayments();
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const calculateStats = () => {
    const total = payments.length;
    const completed = payments.filter((p) => p.status === 'completed').length;
    const pending = payments.filter((p) => p.status === 'pending').length;
    const failed = payments.filter((p) => p.status === 'failed').length;
    const refunded = payments.filter((p) => p.status === 'refunded').length;
    const totalAmount = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => {
        const amount = typeof p.amount === 'number' ? p.amount : parseFloat(p.amount) || 0;
        return sum + amount;
      }, 0);

    return { total, completed, pending, failed, refunded, totalAmount: Number(totalAmount) || 0 };
  };

  const stats = calculateStats();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t('payments.paymentHistory')}
              </h2>
              <p className="text-gray-600 mt-1">
                {t('payments.subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4" />
              {t('payments.filters')}
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('payments.totalPayments')}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('payments.completed')}</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('payments.pending')}</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('payments.failed')}</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {stats.failed}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('payments.refunded')}</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.refunded}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('payments.totalRevenue')}</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">
                    {(stats.totalAmount || 0).toFixed(2)} DA
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.event')}
                  </label>
                  <select
                    value={filters.event_id}
                    onChange={(e) => setFilters({ ...filters, event_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  >
                    <option value="">{t('payments.allEvents')}</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.status')}
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  >
                    <option value="">{t('payments.allStatuses')}</option>
                    <option value="pending">{t('payments.pending')}</option>
                    <option value="completed">{t('payments.completed')}</option>
                    <option value="failed">{t('payments.failed')}</option>
                    <option value="refunded">{t('payments.refunded')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.startDate')}
                  </label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.endDate')}
                  </label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>
              </div>
              <button
                onClick={() => setFilters({ event_id: '', status: '', start_date: '', end_date: '' })}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {t('payments.clearFilters')}
              </button>
            </div>
          )}

          {/* Payments Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('payments.noPaymentsFound')}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.paymentId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.participant')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.event')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.paymentMethod')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.transactionId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.date')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('payments.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{payment.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user.prenom} {payment.user.nom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {payment.event.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payment.event.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {typeof payment.amount === 'number' 
                              ? payment.amount.toFixed(2) 
                              : (parseFloat(payment.amount) || 0).toFixed(2)} DA
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}
                          >
                            {getStatusIcon(payment.status)}
                            {t(`payments.${payment.status}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {payment.payment_method || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-500">
                            {payment.transaction_id || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {payment.paid_at
                              ? new Date(payment.paid_at).toLocaleDateString()
                              : new Date(payment.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(payment.id, 'completed')}
                                className="text-green-600 hover:text-green-900"
                                title={t('payments.markAsCompleted')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(payment.id, 'failed')}
                                className="text-red-600 hover:text-red-900"
                                title={t('payments.markAsFailed')}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => handleStatusUpdate(payment.id, 'refunded')}
                              className="text-orange-600 hover:text-orange-900"
                              title={t('payments.markAsRefunded')}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                          {!['pending', 'completed'].includes(payment.status) && (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

