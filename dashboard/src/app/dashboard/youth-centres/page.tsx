'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService, YouthCentre, Admin } from '@/lib/api';
import { Edit2, Save, X, Building2, MapPin, Users, Phone, Mail, Globe, CheckCircle, XCircle, Plus, Trash2, UserPlus, Calendar } from 'lucide-react';

export default function YouthCentresPage() {
  const { admin, isSuperAdmin, refreshAdmin } = useAuth();
  const { t } = useLanguage();
  const [youthCentres, setYouthCentres] = useState<YouthCentre[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<YouthCentre | null>(null);
  const [centreAdmins, setCentreAdmins] = useState<Admin[]>([]);
  const [unassignedAdmins, setUnassignedAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [isEditingCentre, setIsEditingCentre] = useState(false);
  const [isCreatingCentre, setIsCreatingCentre] = useState(false);
  const [isManagingAdmins, setIsManagingAdmins] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null,
    location: '',
    number_of_places: 0,
    available_formations: [] as string[],
    available_activities: [] as string[],
    description: '',
    phone_number: '',
    email: '',
    website: '',
    address: '',
    wilaya: '',
    commune: '',
    latitude: '',
    longitude: '',
    is_active: true,
  });
  const [newFormation, setNewFormation] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadYouthCentres();
  }, []);

  useEffect(() => {
    if (selectedCentre) {
      loadCentreAdmins(selectedCentre.id);
      if (isManagingAdmins) {
        loadUnassignedAdmins();
      }
    }
  }, [selectedCentre, isManagingAdmins]);

  const loadYouthCentres = async () => {
    try {
      setLoading(true);
      const response = await apiService.getYouthCentres();
      if (response.success && response.data) {
        const centres = response.data.youth_centres;
        setYouthCentres(centres);
        // For regular admins, auto-select their centre
        if (!isSuperAdmin && centres.length > 0) {
          setSelectedCentre(centres[0]);
        } else if (isSuperAdmin && centres.length > 0 && !selectedCentre) {
          setSelectedCentre(centres[0]);
        }
      }
    } catch (error) {
      console.error('Error loading youth centres:', error);
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

  const handleCreateCentre = () => {
    setIsCreatingCentre(true);
    setFormData({
      name: '',
      image: null,
      location: '',
      number_of_places: 0,
      available_formations: [],
      available_activities: [],
      description: '',
      phone_number: '',
      email: '',
      website: '',
      address: '',
      wilaya: '',
      commune: '',
      latitude: '',
      longitude: '',
      is_active: true,
    });
    setError(null);
    setSuccess(null);
  };

  const handleEditCentre = () => {
    if (!selectedCentre) return;
    setIsEditingCentre(true);
    setIsCreatingCentre(false);
    setFormData({
      name: selectedCentre.name,
      image: null,
      location: selectedCentre.location,
      number_of_places: selectedCentre.number_of_places,
      available_formations: selectedCentre.available_formations || [],
      available_activities: selectedCentre.available_activities || [],
      description: selectedCentre.description || '',
      phone_number: selectedCentre.phone_number || '',
      email: selectedCentre.email || '',
      website: selectedCentre.website || '',
      address: selectedCentre.address || '',
      wilaya: selectedCentre.wilaya || '',
      commune: selectedCentre.commune || '',
      latitude: selectedCentre.latitude?.toString() || '',
      longitude: selectedCentre.longitude?.toString() || '',
      is_active: selectedCentre.is_active,
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditingCentre(false);
    setIsCreatingCentre(false);
    setError(null);
    setSuccess(null);
  };

  const handleSaveCentre = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('number_of_places', formData.number_of_places.toString());
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('phone_number', formData.phone_number || '');
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('wilaya', formData.wilaya || '');
      formDataToSend.append('commune', formData.commune || '');
      formDataToSend.append('latitude', formData.latitude || '');
      formDataToSend.append('longitude', formData.longitude || '');
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('available_formations', JSON.stringify(formData.available_formations));
      formDataToSend.append('available_activities', JSON.stringify(formData.available_activities));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (isCreatingCentre) {
        // Creating new centre
        response = await apiService.createYouthCentre(formDataToSend);
        if (response.success) {
          setSuccess(t('youthCentres.createdSuccessfully') || 'Youth centre created successfully');
          setIsCreatingCentre(false);
          // Refresh admin data to get updated youth_centre_id
          if (!isSuperAdmin) {
            await refreshAdmin();
          }
          await loadYouthCentres();
          // Auto-select the newly created centre
          if (response.data?.youth_centre) {
            setSelectedCentre(response.data.youth_centre);
          }
        } else {
          const errorMessage = response.errors 
            ? Object.values(response.errors).flat().join('\n')
            : response.message || t('youthCentres.errorSaving');
          setError(errorMessage);
        }
      } else if (selectedCentre) {
        // Updating existing centre
        response = await apiService.updateYouthCentre(selectedCentre.id, formDataToSend);
        if (response.success) {
          setSuccess(t('youthCentres.updatedSuccessfully') || 'Youth centre updated successfully');
          setIsEditingCentre(false);
          await loadYouthCentres();
          // Update selected centre
          if (response.data?.youth_centre) {
            setSelectedCentre(response.data.youth_centre);
          }
        } else {
          const errorMessage = response.errors 
            ? Object.values(response.errors).flat().join('\n')
            : response.message || t('youthCentres.errorSaving');
          setError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error saving youth centre:', error);
      setError(t('youthCentres.errorSaving') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdmin = async () => {
    if (!selectedCentre || !selectedAdminId) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.assignAdminToYouthCentre(selectedCentre.id, selectedAdminId);
      
      if (response.success) {
        setSuccess(t('youthCentres.adminAssigned') || 'Admin assigned successfully');
        setSelectedAdminId(null);
        await loadCentreAdmins(selectedCentre.id);
        await loadUnassignedAdmins();
      } else {
        setError(response.message || 'Failed to assign admin');
      }
    } catch (error) {
      console.error('Error assigning admin:', error);
      setError('Failed to assign admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: number) => {
    if (!selectedCentre) return;
    if (!confirm(t('youthCentres.removeAdminConfirm') || 'Are you sure you want to remove this admin?')) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.removeAdminFromYouthCentre(selectedCentre.id, adminId);
      
      if (response.success) {
        setSuccess(t('youthCentres.adminRemoved') || 'Admin removed successfully');
        await loadCentreAdmins(selectedCentre.id);
        await loadUnassignedAdmins();
      } else {
        setError(response.message || 'Failed to remove admin');
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      setError('Failed to remove admin');
    } finally {
      setLoading(false);
    }
  };

  const addFormation = () => {
    if (newFormation.trim()) {
      setFormData({
        ...formData,
        available_formations: [...formData.available_formations, newFormation.trim()],
      });
      setNewFormation('');
    }
  };

  const removeFormation = (index: number) => {
    setFormData({
      ...formData,
      available_formations: formData.available_formations.filter((_, i) => i !== index),
    });
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      setFormData({
        ...formData,
        available_activities: [...formData.available_activities, newActivity.trim()],
      });
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    setFormData({
      ...formData,
      available_activities: formData.available_activities.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Show create form if regular admin has no centre and is creating one
  if (!isSuperAdmin && !selectedCentre && isCreatingCentre) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('youthCentres.createCentre')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t('youthCentres.createCentreDesc') || 'Create your youth centre'}
                </p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {t('youthCentres.cancel')}
              </button>
            </div>

            {/* Create Form - same as edit form */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleSaveCentre} className="space-y-4">
                  {/* All form fields from the edit form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.location')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('youthCentres.image')}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('youthCentres.description')}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Rest of form fields... */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.numberOfPlaces')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.number_of_places}
                        onChange={(e) => setFormData({ ...formData, number_of_places: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.wilaya')}
                      </label>
                      <input
                        type="text"
                        value={formData.wilaya}
                        onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.commune')}
                      </label>
                      <input
                        type="text"
                        value={formData.commune}
                        onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('youthCentres.email')}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Formations and Activities sections */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('youthCentres.availableFormations')}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFormation}
                        onChange={(e) => setNewFormation(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFormation();
                          }
                        }}
                        placeholder={t('youthCentres.addFormation')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={addFormation}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        {t('youthCentres.add')}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.available_formations.map((formation, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-2"
                        >
                          {formation}
                          <button
                            type="button"
                            onClick={() => removeFormation(index)}
                            className="text-blue-800 hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('youthCentres.availableActivities')}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addActivity();
                          }
                        }}
                        placeholder={t('youthCentres.addActivity')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={addActivity}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        {t('youthCentres.add')}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.available_activities.map((activity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center gap-2"
                        >
                          {activity}
                          <button
                            type="button"
                            onClick={() => removeActivity(index)}
                            className="text-purple-800 hover:text-purple-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? t('youthCentres.saving') || 'Creating...' : t('youthCentres.create')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      {t('youthCentres.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // For super admins, show list if no centre selected, or if they want to switch
  if (isSuperAdmin && youthCentres.length > 0 && !selectedCentre) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t('youthCentres.title')}
              </h2>
              <p className="text-gray-600 mt-1">
                {t('youthCentres.selectCentre') || 'Select a youth centre to manage'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {youthCentres.map((centre) => (
                <button
                  key={centre.id}
                  onClick={() => setSelectedCentre(centre)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-left border-2 border-transparent hover:border-indigo-500"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{centre.name}</h3>
                  <p className="text-sm text-gray-600">{centre.location}</p>
                </button>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Regular admin with no centre - show create button
  if (!isSuperAdmin && !selectedCentre && !isCreatingCentre) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t('youthCentres.title')}
              </h2>
              <p className="text-gray-600 mt-1">
                {t('youthCentres.createYourCentre') || 'Create your youth centre to get started'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">{t('youthCentres.noCentreYet') || "You don't have a youth centre yet. Create one to get started."}</p>
              <button
                onClick={handleCreateCentre}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                {t('youthCentres.createCentre')}
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!selectedCentre && !isCreatingCentre) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('youthCentres.noCentresFound')}</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Super Admin: Centre Selector */}
          {isSuperAdmin && youthCentres.length > 1 && selectedCentre && (
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('youthCentres.selectCentre') || 'Select Youth Centre'}
              </label>
              <select
                value={selectedCentre.id}
                onChange={(e) => {
                  const centre = youthCentres.find(c => c.id === parseInt(e.target.value));
                  if (centre) setSelectedCentre(centre);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {youthCentres.map((centre) => (
                  <option key={centre.id} value={centre.id}>
                    {centre.name} - {centre.location}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Youth Centre Overview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-8 text-center">
                  {selectedCentre.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/storage/${selectedCentre.image}`}
                      alt={selectedCentre.name}
                      className="h-24 w-24 rounded-full mx-auto object-cover border-4 border-white/30 shadow-lg"
                    />
                  ) : (
                    <div className="inline-block">
                      <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-4xl shadow-lg border-4 border-white/30 mx-auto">
                        <Building2 className="h-12 w-12" />
                      </div>
                    </div>
                  )}
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {selectedCentre.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      selectedCentre.is_active
                        ? 'bg-green-500/20 text-white border border-white/30'
                        : 'bg-gray-500/20 text-white border border-white/30'
                    }`}
                  >
                    {selectedCentre.is_active ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('youthCentres.active')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        {t('youthCentres.inactive')}
                      </>
                    )}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-sm">{selectedCentre.location}</span>
                  </div>
                  {selectedCentre.wilaya && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">{selectedCentre.wilaya}{selectedCentre.commune ? `, ${selectedCentre.commune}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-sm">{selectedCentre.number_of_places} {t('youthCentres.places')}</span>
                  </div>
                  {selectedCentre.admins_count !== undefined && (
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">{selectedCentre.admins_count} {t('youthCentres.admins')}</span>
                    </div>
                  )}
                  {selectedCentre.phone_number && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">{selectedCentre.phone_number}</span>
                    </div>
                  )}
                  {selectedCentre.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm truncate">{selectedCentre.email}</span>
                    </div>
                  )}
                  {selectedCentre.created_at && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">
                        {new Date(selectedCentre.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Centre Information & Admins Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Centre Information Card */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    {t('youthCentres.information') || 'Youth Centre Information'}
                  </h3>
                  {!isEditingCentre && !isCreatingCentre && (isSuperAdmin || admin?.youth_centre_id === selectedCentre.id) && (
                    <button
                      onClick={handleEditCentre}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      {t('youthCentres.edit')}
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {(isEditingCentre || isCreatingCentre) ? (
                    <form onSubmit={handleSaveCentre} className="space-y-4">
                      {/* Form fields - similar to original but more compact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.name')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.location')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('youthCentres.image')}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('youthCentres.description')}
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.numberOfPlaces')}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.number_of_places}
                            onChange={(e) => setFormData({ ...formData, number_of_places: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.wilaya')}
                          </label>
                          <input
                            type="text"
                            value={formData.wilaya}
                            onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.commune')}
                          </label>
                          <input
                            type="text"
                            value={formData.commune}
                            onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.phoneNumber')}
                          </label>
                          <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('youthCentres.email')}
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('youthCentres.website')}
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>

                      {/* Formations and Activities */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('youthCentres.availableFormations')}
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newFormation}
                            onChange={(e) => setNewFormation(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addFormation();
                              }
                            }}
                            placeholder={t('youthCentres.addFormation')}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={addFormation}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            {t('youthCentres.add')}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.available_formations.map((formation, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-2"
                            >
                              {formation}
                              <button
                                type="button"
                                onClick={() => removeFormation(index)}
                                className="text-blue-800 hover:text-blue-900"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('youthCentres.availableActivities')}
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newActivity}
                            onChange={(e) => setNewActivity(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addActivity();
                              }
                            }}
                            placeholder={t('youthCentres.addActivity')}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={addActivity}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            {t('youthCentres.add')}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.available_activities.map((activity, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center gap-2"
                            >
                              {activity}
                              <button
                                type="button"
                                onClick={() => removeActivity(index)}
                                className="text-purple-800 hover:text-purple-900"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="mr-2"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                          {t('youthCentres.active')}
                        </label>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          <Save className="h-4 w-4" />
                          {loading 
                            ? (isCreatingCentre ? t('youthCentres.creating') || 'Creating...' : t('youthCentres.saving') || 'Saving...') 
                            : (isCreatingCentre ? t('youthCentres.create') : t('youthCentres.saveChanges') || 'Save Changes')}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          {t('youthCentres.cancel')}
                        </button>
                      </div>
                    </form>
                  ) : (
                    selectedCentre && (
                      <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.name')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{selectedCentre.name}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.location')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{selectedCentre.location}</p>
                        </div>
                        {selectedCentre.description && (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              {t('youthCentres.description')}
                            </label>
                            <p className="text-sm text-gray-900">{selectedCentre.description}</p>
                          </div>
                        )}
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
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('youthCentres.numberOfPlaces')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{selectedCentre.number_of_places}</p>
                        </div>
                      </div>

                      {(selectedCentre.available_formations?.length > 0 || selectedCentre.available_activities?.length > 0) && (
                        <div className="pt-4 border-t border-gray-200">
                          {selectedCentre.available_formations?.length > 0 && (
                            <div className="mb-4">
                              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                {t('youthCentres.formations')}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {selectedCentre.available_formations.map((formation, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {formation}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedCentre.available_activities?.length > 0 && (
                            <div>
                              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                {t('youthCentres.activities')}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {selectedCentre.available_activities.map((activity, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                  >
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    )
                  )}
                </div>
              </div>

              {/* Admins Management Card - Show for both super admins and regular admins with a youth centre */}
              {selectedCentre && (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                      {t('youthCentres.adminsManagement') || 'Admins Management'}
                    </h3>
                    {!isManagingAdmins && (
                      <button
                        onClick={() => {
                          setIsManagingAdmins(true);
                          loadUnassignedAdmins();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        {t('youthCentres.manageAdmins') || 'Manage Admins'}
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    {isManagingAdmins ? (
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
                              onClick={handleAssignAdmin}
                              disabled={!selectedAdminId || loading}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {t('youthCentres.assign') || 'Assign'}
                            </button>
                            <button
                              onClick={() => setIsManagingAdmins(false)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Current Admins List */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('youthCentres.currentAdmins') || 'Current Admins'} ({centreAdmins.length})
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
                                    onClick={() => handleRemoveAdmin(admin.id)}
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
                        <p className="text-sm text-gray-600 mb-4">
                          {centreAdmins.length} {t('youthCentres.adminsAssigned') || 'admin(s) assigned to this youth centre'}
                        </p>
                        {centreAdmins.length > 0 && (
                          <div className="space-y-2">
                            {centreAdmins.slice(0, 3).map((admin) => (
                              <div key={admin.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                                <p className="text-xs text-gray-500">{admin.email}</p>
                              </div>
                            ))}
                            {centreAdmins.length > 3 && (
                              <p className="text-xs text-gray-500 text-center">
                                +{centreAdmins.length - 3} more
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}