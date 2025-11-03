'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/lib/api';
import { User, Edit2, Save, X, Lock, Eye, EyeOff, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { admin, isSuperAdmin, refreshAdmin } = useAuth();
  const { t } = useLanguage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Extract nom and prenom from name (if space-separated)
  const getNameParts = () => {
    if (!admin?.name) return { nom: '', prenom: '' };
    const parts = admin.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return { nom: parts[0], prenom: parts.slice(1).join(' ') };
    }
    return { nom: admin.name, prenom: '' };
  };

  const { nom, prenom } = getNameParts();

  // Update profile data when admin changes
  useEffect(() => {
    if (admin && !isEditingProfile) {
      setProfileData({
        name: admin.name || '',
        email: admin.email || '',
      });
    }
  }, [admin, isEditingProfile]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: admin?.name || '',
      email: admin?.email || '',
    });
    setError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.updateAdminProfile({
        name: profileData.name,
        email: profileData.email,
      });

      if (response.success) {
        setSuccess(t('profile.profileUpdated'));
        setIsEditingProfile(false);
        await refreshAdmin();
        if (response.data?.admin) {
          setProfileData({
            name: response.data.admin.name || '',
            email: response.data.admin.email || '',
          });
        }
      } else {
        setError(response.message || t('profile.failedToUpdateProfile'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.anErrorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('profile.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError(t('profile.passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      if (response.success) {
        setSuccess(t('profile.passwordChanged'));
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(response.message || t('profile.failedToChangePassword'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.anErrorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError(null);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{t('profile.title')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('profile.subtitle')}</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-8 text-center">
                  <div className="inline-block">
                    <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-4xl shadow-lg border-4 border-white/30">
                      {admin?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {nom} {prenom && prenom}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      isSuperAdmin
                        ? 'bg-purple-500/20 text-white border border-white/30'
                        : 'bg-blue-500/20 text-white border border-white/30'
                    }`}
                  >
                    {isSuperAdmin ? t('common.superAdmin') : t('common.admin')}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    <span className="text-sm truncate">{admin?.email || '-'}</span>
                  </div>
                  {admin?.created_at && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">
                        {t('profile.joined')} {new Date(admin.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information & Password Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information Card */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    {t('profile.profileInformation')}
                  </h3>
                  {!isEditingProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      {t('profile.edit')}
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('profile.fullName')}
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('profile.emailAddress')}
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          <Save className="h-4 w-4" />
                          {loading ? t('profile.saving') : t('profile.saveChanges')}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          {t('profile.cancel')}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('profile.nom')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{nom || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('profile.prenom')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{prenom || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('profile.email')}
                          </label>
                          <p className="text-sm font-medium text-gray-900">{admin?.email || '-'}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {t('profile.role')}
                          </label>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              isSuperAdmin
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isSuperAdmin ? t('common.superAdmin') : t('common.admin')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password Card */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-indigo-600" />
                    {t('profile.security')}
                  </h3>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      {t('profile.changePassword')}
                    </button>
                  )}
                </div>

                {isChangingPassword ? (
                  <div className="p-6">
                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('profile.currentPassword')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('profile.newPassword')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{t('profile.passwordMinLength')}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('profile.confirmNewPassword')}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          <Save className="h-4 w-4" />
                          {loading ? t('profile.changing') : t('profile.changePasswordButton')}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelPassword}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          {t('profile.cancel')}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t('profile.password')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('profile.passwordLastUpdated')}</p>
                      </div>
                      <Shield className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
