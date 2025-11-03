'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import frTranslations from '@/locales/fr';
import arTranslations from '@/locales/ar';
import enTranslations from '@/locales/en';
import { apiService, Livestream, Event } from '@/lib/api';
import { Edit, Trash2, Radio, Video, Copy, Check, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LivestreamsPage() {
  const { isSuperAdmin } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLivestream, setEditingLivestream] = useState<Livestream | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stream_url: '',
    channel_name: '',
    use_agora: false,
    is_live: false,
    event_id: '',
  });
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedLivestream, setSelectedLivestream] = useState<Livestream | null>(null);
  const [agoraTokens, setAgoraTokens] = useState<{
    rtcToken?: string;
    rtmToken?: string;
    appId?: string;
    channelName?: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadLivestreams();
    loadEvents();
  }, []);

  const loadLivestreams = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLivestreams();
      if (response.success && response.data) {
        setLivestreams(response.data.livestreams);
      }
    } catch (error) {
      console.error('Error loading livestreams:', error);
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
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        title: formData.title,
        description: formData.description,
        is_live: formData.is_live,
      };

      // If using Agora, use channel_name; otherwise use stream_url
      if (formData.use_agora) {
        // Only send channel_name if provided, otherwise let server auto-generate
        if (formData.channel_name && formData.channel_name.trim()) {
          data.channel_name = formData.channel_name;
        }
        // Don't include stream_url at all when using Agora
      } else {
        // Validate that stream_url is provided
        if (!formData.stream_url || formData.stream_url.trim() === '') {
          alert(t('livestreams.pleaseProvideUrl'));
          return;
        }
        data.stream_url = formData.stream_url;
        // Don't include channel_name when using URL streaming
      }

      if (formData.event_id) {
        data.event_id = parseInt(formData.event_id);
      }

      const response = editingLivestream
        ? await apiService.updateLivestream(editingLivestream.id, data)
        : await apiService.createLivestream(data);

      if (!response.success) {
        alert(response.message || t('livestreams.failedToSave'));
        return;
      }

      setShowModal(false);
      setEditingLivestream(null);
      setFormData({
        title: '',
        description: '',
        stream_url: '',
        channel_name: '',
        use_agora: false,
        is_live: false,
        event_id: '',
      });
      loadLivestreams();
    } catch (error: any) {
      console.error('Error saving livestream:', error);
      const errorMessage = error?.message || error?.response?.data?.message || t('livestreams.errorSaving');
      alert(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('livestreams.deleteConfirm'))) {
      try {
        await apiService.deleteLivestream(id);
        loadLivestreams();
      } catch (error) {
        console.error('Error deleting livestream:', error);
      }
    }
  };

  const openEditModal = (livestream: Livestream) => {
    setEditingLivestream(livestream);
    setFormData({
      title: livestream.title,
      description: livestream.description || '',
      stream_url: livestream.stream_url || '',
      channel_name: livestream.channel_name || '',
      use_agora: !!livestream.channel_name,
      is_live: livestream.is_live,
      event_id: livestream.event_id?.toString() || '',
    });
    setShowModal(true);
  };

  const handleGenerateTokens = async (livestream: Livestream) => {
    if (!livestream.channel_name) {
      alert(t('livestreams.noChannelName'));
      return;
    }

    try {
      // Use admin ID as userId for RTM token
      const adminProfile = await apiService.getAdminProfile();
      const userId = adminProfile.data?.admin?.id?.toString() || 'admin-' + Date.now();

      const response = await apiService.getAgoraTokens({
        channelName: livestream.channel_name,
        userId,
        role: 'broadcaster',
        uid: 0,
      });

      if (response.success && response.data) {
        setAgoraTokens({
          rtcToken: response.data.rtcToken,
          rtmToken: response.data.rtmToken,
          appId: response.data.appId,
          channelName: response.data.channelName,
        });
        setSelectedLivestream(livestream);
        setShowTokenModal(true);
      } else {
        alert(`${t('livestreams.failedToGenerateTokens')}: ${response.message || t('livestreams.checkAgoraConfig')}`);
      }
    } catch (error) {
      console.error('Error generating tokens:', error);
      alert(t('livestreams.errorGeneratingTokens'));
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t('livestreams.management')}
              </h2>
              <p className="text-gray-600 mt-1">
                {t('livestreams.subtitle')}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingLivestream(null);
                setFormData({
                  title: '',
                  description: '',
                  stream_url: '',
                  channel_name: '',
                  use_agora: false,
                  is_live: false,
                  event_id: '',
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + {t('livestreams.createLivestream')}
            </button>
          </div>

          {/* Livestreams List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block  rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
            </div>
          ) : livestreams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">{t('livestreams.noLivestreamsFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {livestreams.map((livestream) => (
                <div
                  key={livestream.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {livestream.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            livestream.is_live
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {livestream.is_live && <Radio className="h-3 w-3 fill-current" />}
                          {livestream.is_live ? t('livestreams.live') : t('livestreams.offline')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {livestream.channel_name && (
                        <>
                          <button
                            onClick={() => router.push(`/dashboard/stream/${livestream.id}`)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title={t('livestreams.goLive')}
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleGenerateTokens(livestream)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title={t('livestreams.getAgoraTokens')}
                          >
                            <Video className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openEditModal(livestream)}
                        className="text-indigo-600 hover:text-indigo-700 p-1"
                        title={t('livestreams.edit')}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(livestream.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title={t('livestreams.delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {livestream.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {livestream.description}
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    {livestream.channel_name ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{t('livestreams.agoraChannel')}</span>
                          <span className="text-indigo-600 font-mono text-xs">
                            {livestream.channel_name}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          {t('livestreams.agoraStream')}
                        </span>
                      </div>
                    ) : livestream.stream_url ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{t('livestreams.url')}</span>
                        <a
                          href={livestream.stream_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline truncate"
                        >
                          {livestream.stream_url}
                        </a>
                      </div>
                    ) : null}
                    {livestream.event_id && (
                      <p className="text-xs text-gray-500">
                        {t('livestreams.eventId')}: {livestream.event_id}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[100]">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingLivestream ? t('livestreams.editLivestream') : t('livestreams.createLivestream')}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('livestreams.titleLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('livestreams.descriptionLabel')}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="use_agora"
                      checked={formData.use_agora}
                      onChange={(e) => setFormData({ ...formData, use_agora: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="use_agora" className="text-sm text-gray-700">
                      {t('livestreams.useAgora')}
                    </label>
                  </div>

                  {formData.use_agora ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('livestreams.channelNameLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.channel_name}
                        onChange={(e) => setFormData({ ...formData, channel_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        placeholder={t('livestreams.channelNamePlaceholder')}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {t('livestreams.channelNameHint')}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('livestreams.streamUrlLabel')}
                      </label>
                      <input
                        type="url"
                        required={!formData.use_agora}
                        value={formData.stream_url}
                        onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        placeholder={t('livestreams.streamUrlPlaceholder')}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('livestreams.eventOptional')}
                    </label>
                    <select
                      value={formData.event_id}
                      onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    >
                      <option value="">{t('livestreams.noEvent')}</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_live"
                      checked={formData.is_live}
                      onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="is_live" className="text-sm text-gray-700">
                      {t('livestreams.currentlyLive')}
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      {editingLivestream ? t('livestreams.update') : t('livestreams.create')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingLivestream(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                    >
                      {t('livestreams.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Agora Tokens Modal */}
          {showTokenModal && agoraTokens && selectedLivestream && (
            <div className="fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[100]">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('livestreams.agoraTokensFor')} {selectedLivestream.title}
                  </h3>
                  <button
                    onClick={() => {
                      setShowTokenModal(false);
                      setAgoraTokens(null);
                      setSelectedLivestream(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>{t('livestreams.important')}</strong> {t('livestreams.tokensSecure')}
                    </p>
                  </div>

                  {/* App ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('livestreams.appId')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={agoraTokens.appId || ''}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(agoraTokens.appId || '', 'appId')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title={t('livestreams.copy')}
                      >
                        {copiedField === 'appId' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Channel Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('livestreams.channelName')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={agoraTokens.channelName || ''}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(agoraTokens.channelName || '', 'channelName')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title={t('livestreams.copy')}
                      >
                        {copiedField === 'channelName' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* RTC Token */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('livestreams.rtcToken')}
                    </label>
                    <div className="flex items-center gap-2">
                      <textarea
                        readOnly
                        value={agoraTokens.rtcToken || ''}
                        rows={3}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs"
                      />
                      <button
                        onClick={() => copyToClipboard(agoraTokens.rtcToken || '', 'rtcToken')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title={t('livestreams.copy')}
                      >
                        {copiedField === 'rtcToken' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* RTM Token */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('livestreams.rtmToken')}
                    </label>
                    <div className="flex items-center gap-2">
                      <textarea
                        readOnly
                        value={agoraTokens.rtmToken || ''}
                        rows={3}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-xs"
                      />
                      <button
                        onClick={() => copyToClipboard(agoraTokens.rtmToken || '', 'rtmToken')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title={t('livestreams.copy')}
                      >
                        {copiedField === 'rtmToken' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>{t('livestreams.usageInstructions')}</strong>
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                      {(() => {
                        const translations = language === 'ar' ? arTranslations : language === 'en' ? enTranslations : frTranslations;
                        const instructions = translations.livestreams?.usageInstructionsList;
                        if (Array.isArray(instructions)) {
                          return instructions.map((instruction: string, index: number) => (
                            <li key={index}>{instruction}</li>
                          ));
                        }
                        return null;
                      })()}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setShowTokenModal(false);
                      setAgoraTokens(null);
                      setSelectedLivestream(null);
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {t('livestreams.close')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
