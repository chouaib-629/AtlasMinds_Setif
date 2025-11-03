'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, YouthCentre, Admin } from '@/lib/api';
import { Building2, Users, Plus, Trash2, X, UserPlus, MapPin, Phone, Mail, Globe, CheckCircle, XCircle } from 'lucide-react';

export default function ManageYouthCentresPage() {
  const { admin, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [youthCentres, setYouthCentres] = useState<YouthCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCentre, setSelectedCentre] = useState<YouthCentre | null>(null);
  const [centreAdmins, setCentreAdmins] = useState<Admin[]>([]);
  const [unassignedAdmins, setUnassignedAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isManagingAdmins, setIsManagingAdmins] = useState<number | null>(null); // Store centre ID being managed

  useEffect(() => {
    if (!isSuperAdmin) {
      // Redirect if not super admin
      window.location.href = '/dashboard';
      return;
    }
    loadYouthCentres();
    loadUnassignedAdmins();
  }, [isSuperAdmin]);

  useEffect(() => {
    if (selectedCentre) {
      loadCentreAdmins(selectedCentre.id);
    }
  }, [selectedCentre]);

  const loadYouthCentres = async () => {
    try {
      setLoading(true);
      const response = await apiService.getYouthCentres();
      if (response.success && response.data) {
        setYouthCentres(response.data.youth_centres);
      }
    } catch (error) {
      console.error('Error loading youth centres:', error);
      setError(t('youthCentres.errorLoading') || 'Failed to load youth centres');
    } finally {
      setLoading(false);
    }
  };

  const loadCentreAdmins = async (centreId: number) => {
    try {
      setLoadingAdmins(true);
      const response = await apiService.getYouthCentreAdmins(centreId);
      if (response.success && response.data) {
        setCentreAdmins(response.data.admins);
      }
    } catch (error) {
      console.error('Error loading centre admins:', error);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const loadUnassignedAdmins = async () => {
    try {
      const response = await apiService.getUnassignedAdmins();
      if (response.success && response.data) {
        setUnassignedAdmins(response.data.admins);
      }
    } catch (error) {
      console.error('Error loading unassigned admins:', error);
    }
  };

  const handleSelectCentre = (centre: YouthCentre) => {
    setSelectedCentre(centre);
    setIsManagingAdmins(null);
    setSelectedAdminId(null);
    setError(null);
    setSuccess(null);
  };

  const handleAssignAdmin = async (centreId: number) => {
    if (!selectedAdminId) return;
    
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.assignAdminToYouthCentre(centreId, selectedAdminId);
      
      if (response.success) {
        setSuccess(t('youthCentres.adminAssigned') || 'Admin assigned successfully');
        setSelectedAdminId(null);
        await loadCentreAdmins(centreId);
        await loadUnassignedAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to assign admin');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error assigning admin:', error);
      setError('Failed to assign admin');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRemoveAdmin = async (centreId: number, adminId: number) => {
    if (!confirm(t('youthCentres.removeAdminConfirm') || 'Are you sure you want to remove this admin?')) return;
    
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.removeAdminFromYouthCentre(centreId, adminId);
      
      if (response.success) {
        setSuccess(t('youthCentres.adminRemoved') || 'Admin removed successfully');
        await loadCentreAdmins(centreId);
        await loadUnassignedAdmins();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to remove admin');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      setError('Failed to remove admin');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteCentre = async (centreId: number, centreName: string) => {
    if (!confirm(t('youthCentres.deleteConfirm') || `Are you sure you want to delete "${centreName}"? This action cannot be undone.`)) return;
    
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.deleteYouthCentre(centreId);
      
      if (response.success) {
        setSuccess(t('youthCentres.deletedSuccessfully') || 'Youth centre deleted successfully');
        await loadYouthCentres();
        if (selectedCentre?.id === centreId) {
          setSelectedCentre(null);
          setIsManagingAdmins(null);
        }
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Failed to delete youth centre');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error deleting youth centre:', error);
      setError('Failed to delete youth centre');
      setTimeout(() => setError(null), 5000);
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-4">{t('common.loading')}</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('nav.manageYouthCentres') || 'Manage Youth Centres'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t('youthCentres.manageAllCentres') || 'View and manage all youth centres, their admins, and assignments'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded shadow-sm">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded shadow-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Youth Centres List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    {t('youthCentres.allCentres') || 'All Youth Centres'} ({youthCentres.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {youthCentres.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      {t('youthCentres.noCentresFound')}
                    </div>
                  ) : (
                    youthCentres.map((centre) => (
                      <button
                        key={centre.id}
                        onClick={() => handleSelectCentre(centre)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedCentre?.id === centre.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{centre.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {centre.location}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Users className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {centre.admins_count || 0} {t('youthCentres.admins') || 'admins'}
                              </span>
                            </div>
                          </div>
                          {centre.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Centre Details & Admins Management */}
            <div className="lg:col-span-2 space-y-6">
              {selectedCentre ? (
                <>
                  {/* Centre Information */}
                  <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        {selectedCentre.name}
                      </h3>
                      <button
                        onClick={() => handleDeleteCentre(selectedCentre.id, selectedCentre.name)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('youthCentres.delete')}
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.location')}
                          </label>
                          <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {selectedCentre.location}
                          </p>
                        </div>
                        {selectedCentre.wilaya && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t('youthCentres.wilaya')}
                            </label>
                            <p className="text-sm font-medium text-gray-900">{selectedCentre.wilaya}</p>
                          </div>
                        )}
                        {selectedCentre.commune && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t('youthCentres.commune')}
                            </label>
                            <p className="text-sm font-medium text-gray-900">{selectedCentre.commune}</p>
                          </div>
                        )}
                        {selectedCentre.phone_number && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t('youthCentres.phoneNumber')}
                            </label>
                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              {selectedCentre.phone_number}
                            </p>
                          </div>
                        )}
                        {selectedCentre.email && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t('youthCentres.email')}
                            </label>
                            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {selectedCentre.email}
                            </p>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.numberOfPlaces')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{selectedCentre.number_of_places}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.active')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCentre.is_active ? (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('youthCentres.active')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                {t('youthCentres.inactive')}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      {selectedCentre.description && (
                        <div className="mt-4">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.description')}
                          </label>
                          <p className="text-sm text-gray-900">{selectedCentre.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admins Management */}
                  <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        {t('youthCentres.adminsManagement') || 'Admins Management'} ({centreAdmins.length})
                      </h3>
                      {isManagingAdmins !== selectedCentre.id && (
                        <button
                          onClick={() => {
                            setIsManagingAdmins(selectedCentre.id);
                            loadUnassignedAdmins();
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <UserPlus className="h-4 w-4" />
                          {t('youthCentres.manageAdmins') || 'Manage Admins'}
                        </button>
                      )}
                      {isManagingAdmins === selectedCentre.id && (
                        <button
                          onClick={() => {
                            setIsManagingAdmins(null);
                            setSelectedAdminId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                          {t('common.cancel')}
                        </button>
                      )}
                    </div>

                    <div className="p-6">
                      {isManagingAdmins === selectedCentre.id ? (
                        <div className="space-y-4">
                          {/* Assign New Admin */}
                          <div className="pb-4 border-b border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('youthCentres.assignAdmin') || 'Assign Admin'}
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={selectedAdminId || ''}
                                onChange={(e) => setSelectedAdminId(parseInt(e.target.value) || null)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              >
                                <option value="">{t('youthCentres.selectAdmin') || 'Select an admin...'}</option>
                                {unassignedAdmins.map((admin) => (
                                  <option key={admin.id} value={admin.id}>
                                    {admin.name} ({admin.email})
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleAssignAdmin(selectedCentre.id)}
                                disabled={!selectedAdminId}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <Plus className="h-4 w-4" />
                                {t('youthCentres.assign') || 'Assign'}
                              </button>
                            </div>
                          </div>

                          {/* Current Admins List */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('youthCentres.currentAdmins') || 'Current Admins'}
                            </label>
                            {loadingAdmins ? (
                              <div className="text-center py-4">
                                <div className="inline-block rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
                              </div>
                            ) : centreAdmins.length === 0 ? (
                              <p className="text-sm text-gray-500">{t('youthCentres.noAdmins') || 'No admins assigned yet'}</p>
                            ) : (
                              <div className="space-y-2">
                                {centreAdmins.map((admin) => (
                                  <div
                                    key={admin.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                                      <p className="text-xs text-gray-500">{admin.email}</p>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveAdmin(selectedCentre.id, admin.id)}
                                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      {t('youthCentres.remove') || 'Remove'}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {loadingAdmins ? (
                            <div className="text-center py-4">
                              <div className="inline-block rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
                            </div>
                          ) : centreAdmins.length === 0 ? (
                            <p className="text-sm text-gray-500">{t('youthCentres.noAdmins') || 'No admins assigned yet'}</p>
                          ) : (
                            <div className="space-y-2">
                              {centreAdmins.map((admin) => (
                                <div key={admin.id} className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                                  <p className="text-xs text-gray-500">{admin.email}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t('youthCentres.selectCentreToManage') || 'Select a youth centre from the list to view details and manage admins'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

