'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/lib/api';
import {
  Settings as SettingsIcon,
  Bell,
  Globe,
  Database,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function SettingsPage() {
  const { admin, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Algeria Youth Network',
    siteDescription: 'Admin dashboard for youth centers management',
    timezone: 'Africa/Algiers',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    eventReminders: true,
    newInscriptionAlerts: true,
    paymentAlerts: true,
    
    // System Settings
    itemsPerPage: 25,
    autoRefresh: true,
    refreshInterval: 30, // seconds
    enableAnalytics: true,
    enableLogs: true,
    
    // Security Settings
    sessionTimeout: 60, // minutes
    requireStrongPassword: true,
    twoFactorAuth: false,
    ipWhitelist: false,
  });

  // Load settings from API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminSettings();

      if (response.success && response.data?.settings) {
        const apiSettings = response.data.settings;
        
        // Merge API settings with local state
        setSettings((prev) => ({
          ...prev,
          // General settings
          siteName: apiSettings.site_name || prev.siteName,
          siteDescription: apiSettings.site_description || prev.siteDescription,
          timezone: apiSettings.timezone || prev.timezone,
          language: apiSettings.language || prev.language,
          dateFormat: apiSettings.date_format || prev.dateFormat,
          
          // Notification settings
          emailNotifications: apiSettings.notification_settings?.emailNotifications ?? prev.emailNotifications,
          pushNotifications: apiSettings.notification_settings?.pushNotifications ?? prev.pushNotifications,
          eventReminders: apiSettings.notification_settings?.eventReminders ?? prev.eventReminders,
          newInscriptionAlerts: apiSettings.notification_settings?.newInscriptionAlerts ?? prev.newInscriptionAlerts,
          paymentAlerts: apiSettings.notification_settings?.paymentAlerts ?? prev.paymentAlerts,
          
          // System settings
          itemsPerPage: apiSettings.system_settings?.itemsPerPage ?? prev.itemsPerPage,
          autoRefresh: apiSettings.system_settings?.autoRefresh ?? prev.autoRefresh,
          refreshInterval: apiSettings.system_settings?.refreshInterval ?? prev.refreshInterval,
          enableAnalytics: apiSettings.system_settings?.enableAnalytics ?? prev.enableAnalytics,
          enableLogs: apiSettings.system_settings?.enableLogs ?? prev.enableLogs,
          
          // Security settings
          sessionTimeout: apiSettings.security_settings?.sessionTimeout ?? prev.sessionTimeout,
          requireStrongPassword: apiSettings.security_settings?.requireStrongPassword ?? prev.requireStrongPassword,
          twoFactorAuth: apiSettings.security_settings?.twoFactorAuth ?? prev.twoFactorAuth,
          ipWhitelist: apiSettings.security_settings?.ipWhitelist ?? prev.ipWhitelist,
        }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(t('settings.failedToLoadSettings'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Format settings for API
      const apiSettings = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        timezone: settings.timezone,
        language: settings.language,
        date_format: settings.dateFormat,
        notification_settings: {
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          eventReminders: settings.eventReminders,
          newInscriptionAlerts: settings.newInscriptionAlerts,
          paymentAlerts: settings.paymentAlerts,
        },
        system_settings: {
          itemsPerPage: settings.itemsPerPage,
          autoRefresh: settings.autoRefresh,
          refreshInterval: settings.refreshInterval,
          enableAnalytics: settings.enableAnalytics,
          enableLogs: settings.enableLogs,
        },
        security_settings: isSuperAdmin ? {
          sessionTimeout: settings.sessionTimeout,
          requireStrongPassword: settings.requireStrongPassword,
          twoFactorAuth: settings.twoFactorAuth,
          ipWhitelist: settings.ipWhitelist,
        } : null,
      };

      const response = await apiService.updateAdminSettings(apiSettings);

      if (response.success) {
        setSuccess(t('settings.settingsSavedSuccessfully'));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || t('settings.failedToSaveSettings'));
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('settings.failedToSaveSettings'));
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm(t('settings.resetConfirm'))) {
      const defaultSettings = {
        siteName: 'Algeria Youth Network',
        siteDescription: 'Admin dashboard for youth centers management',
        timezone: 'Africa/Algiers',
        language: 'fr',
        dateFormat: 'DD/MM/YYYY',
        emailNotifications: true,
        pushNotifications: false,
        eventReminders: true,
        newInscriptionAlerts: true,
        paymentAlerts: true,
        itemsPerPage: 25,
        autoRefresh: true,
        refreshInterval: 30,
        enableAnalytics: true,
        enableLogs: true,
        sessionTimeout: 60,
        requireStrongPassword: true,
        twoFactorAuth: false,
        ipWhitelist: false,
      };
      setSettings(defaultSettings);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">{t('settings.loading')}</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{t('settings.title')}</h2>
              <p className="text-sm text-gray-500 mt-1">{t('settings.subtitle')}</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded shadow-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Settings */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('settings.generalSettings')}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.siteName')}
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.siteDescription')}
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.timezone')}
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Africa/Algiers">Africa/Algiers (GMT+1)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.language')}
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="fr">Français</option>
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.dateFormat')}
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('settings.notifications')}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.emailNotifications')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.emailNotificationsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.pushNotifications')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.pushNotificationsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.eventReminders')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.eventRemindersDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.eventReminders}
                        onChange={(e) => setSettings({ ...settings, eventReminders: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.newInscriptionAlerts')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.newInscriptionAlertsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.newInscriptionAlerts}
                        onChange={(e) => setSettings({ ...settings, newInscriptionAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.paymentAlerts')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.paymentAlertsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentAlerts}
                        onChange={(e) => setSettings({ ...settings, paymentAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('settings.systemSettings')}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.itemsPerPage')}
                    </label>
                    <select
                      value={settings.itemsPerPage}
                      onChange={(e) => setSettings({ ...settings, itemsPerPage: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.autoRefresh')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.autoRefreshDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {settings.autoRefresh && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.refreshInterval')}
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={settings.refreshInterval}
                        onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) || 30 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{t('settings.enableAnalytics')}</label>
                      <p className="text-xs text-gray-500 mt-1">{t('settings.enableAnalyticsDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableAnalytics}
                        onChange={(e) => setSettings({ ...settings, enableAnalytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              {isSuperAdmin && (
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('settings.securitySettings')}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.sessionTimeout')}
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 60 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">{t('settings.requireStrongPassword')}</label>
                        <p className="text-xs text-gray-500 mt-1">{t('settings.requireStrongPasswordDesc')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireStrongPassword}
                          onChange={(e) => setSettings({ ...settings, requireStrongPassword: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900">{t('settings.twoFactorAuth')}</label>
                        <p className="text-xs text-gray-500 mt-1">{t('settings.twoFactorAuthDesc')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Save Actions */}
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-6 space-y-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('settings.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {t('settings.saveSettings')}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                  >
                    {t('settings.resetToDefaults')}
                  </button>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">{t('settings.aboutSettings')}</h4>
                    <p className="text-xs text-blue-700">
                      {t('settings.aboutSettingsDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
