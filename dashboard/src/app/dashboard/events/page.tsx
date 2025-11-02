'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { Edit, Trash2, Plus } from 'lucide-react';

type ActivityType = 'events' | 'education' | 'clubs' | 'direct-activities';

interface BaseActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  location?: string;
  attendance_type: 'online' | 'in-person' | 'hybrid';
  price?: number;
  has_price: boolean;
  admin_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface Event extends BaseActivity {
  type: 'national' | 'local' | 'online' | 'hybrid';
}

interface Education extends BaseActivity {
  category?: string;
  time?: string;
  organizer?: string;
  organizer_contact?: string;
  center_id?: number;
  center_name?: string;
  participants: number;
  capacity?: number;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  status?: 'live' | 'upcoming';
  duration?: string;
  level?: 'مبتدئ' | 'متوسط' | 'متقدم';
}

interface Club extends Education {}

interface DirectActivity extends BaseActivity {
  category?: string;
  time?: string;
  organizer?: string;
  organizer_contact?: string;
  center_id?: number;
  center_name?: string;
  participants: number;
  capacity?: number;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  status?: 'live' | 'upcoming';
  votes: number;
  target_audience?: string;
}

export default function EventsPage() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActivityType>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [directActivities, setDirectActivities] = useState<DirectActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, isSuperAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'events':
          const eventsRes = await apiService.getEvents(
            isSuperAdmin ? {} : { type: 'local', attendance_type: 'in-person' }
          );
          if (eventsRes.success && eventsRes.data) {
            setEvents(eventsRes.data.events || []);
          }
          break;
        case 'education':
          const educationsRes = await apiService.getEducations();
          if (educationsRes.success && educationsRes.data) {
            setEducations(educationsRes.data.educations || []);
          }
          break;
        case 'clubs':
          const clubsRes = await apiService.getClubs();
          if (clubsRes.success && clubsRes.data) {
            setClubs(clubsRes.data.clubs || []);
          }
          break;
        case 'direct-activities':
          const activitiesRes = await apiService.getDirectActivities();
          if (activitiesRes.success && activitiesRes.data) {
            setDirectActivities(activitiesRes.data.direct_activities || []);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const itemType = activeTab === 'events' ? 'event' : 
                     activeTab === 'education' ? 'education' :
                     activeTab === 'clubs' ? 'club' : 'direct activity';
    
    if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        switch (activeTab) {
          case 'events':
            await apiService.deleteEvent(id);
            break;
          case 'education':
            await apiService.deleteEducation(id);
            break;
          case 'clubs':
            await apiService.deleteClub(id);
            break;
          case 'direct-activities':
            await apiService.deleteDirectActivity(id);
            break;
        }
        loadData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingItem) {
        // Update
        switch (activeTab) {
          case 'events':
            await apiService.updateEvent(editingItem.id, formData);
            break;
          case 'education':
            await apiService.updateEducation(editingItem.id, formData);
            break;
          case 'clubs':
            await apiService.updateClub(editingItem.id, formData);
            break;
          case 'direct-activities':
            await apiService.updateDirectActivity(editingItem.id, formData);
            break;
        }
      } else {
        // Create
        switch (activeTab) {
          case 'events':
            await apiService.createEvent(formData);
            break;
          case 'education':
            await apiService.createEducation(formData);
            break;
          case 'clubs':
            await apiService.createClub(formData);
            break;
          case 'direct-activities':
            await apiService.createDirectActivity(formData);
            break;
        }
      }
      setShowModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please check all required fields.');
    }
  };

  const getItems = () => {
    switch (activeTab) {
      case 'events':
        return events;
      case 'education':
        return educations;
      case 'clubs':
        return clubs;
      case 'direct-activities':
        return directActivities;
    }
  };

  const tabs = [
    { id: 'events' as ActivityType, label: 'Events' },
    { id: 'education' as ActivityType, label: 'Education' },
    { id: 'clubs' as ActivityType, label: 'Clubs/Groups' },
    { id: 'direct-activities' as ActivityType, label: 'Activities' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Activities Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage events, education, clubs, and activities
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create {activeTab === 'events' ? 'Event' : activeTab === 'education' ? 'Education' : activeTab === 'clubs' ? 'Club' : 'Activity'}
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Items List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : getItems().length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No items found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {activeTab !== 'events' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participants
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getItems().map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                          {item.category && (
                            <div className="text-xs text-gray-500">
                              {item.category}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                          {item.time && (
                            <div className="text-xs text-gray-500">
                              {item.time}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {item.location || 'N/A'}
                          </div>
                          {item.center_name && (
                            <div className="text-xs text-gray-500">
                              {item.center_name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activeTab === 'events' ? (
                            <div className="flex flex-col gap-1">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs w-fit">
                                {item.type}
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs w-fit">
                                {item.attendance_type}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {item.status && (
                                <span className={`px-2 py-1 rounded text-xs w-fit ${
                                  item.status === 'live' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs w-fit ${
                                item.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                              {item.is_featured && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs w-fit">
                                  Featured
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        {activeTab !== 'events' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.participants || 0} / {item.capacity || '∞'}
                            </div>
                            {item.level && (
                              <div className="text-xs text-gray-500">
                                Level: {item.level}
                              </div>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Form Modal */}
          {showModal && (
            <ActivityFormModal
              activeTab={activeTab}
              isSuperAdmin={isSuperAdmin}
              editingItem={editingItem}
              onClose={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Form Modal Component
interface ActivityFormModalProps {
  activeTab: ActivityType;
  isSuperAdmin: boolean;
  editingItem: any;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

function ActivityFormModal({ activeTab, isSuperAdmin, editingItem, onClose, onSubmit }: ActivityFormModalProps) {
  const [formData, setFormData] = useState<any>(() => {
    if (editingItem) {
      // Format date for datetime-local input
      let dateValue = '';
      if (editingItem.date) {
        const date = new Date(editingItem.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = editingItem.time ? editingItem.time.split(':')[0] : String(date.getHours()).padStart(2, '0');
        const minutes = editingItem.time ? editingItem.time.split(':')[1] : String(date.getMinutes()).padStart(2, '0');
        dateValue = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      
      return {
        ...editingItem,
        date: dateValue,
        time: editingItem.time || '',
        price: editingItem.price?.toString() || '',
      };
    }

    // Default values based on type
    const defaults: any = {
      title: '',
      description: '',
      date: '',
      location: '',
      attendance_type: isSuperAdmin ? 'online' : 'in-person',
      has_price: false,
      price: '',
    };

    if (activeTab === 'events') {
      defaults.type = isSuperAdmin ? 'national' : 'local';
    } else {
      defaults.category = activeTab === 'education' ? 'Workshop' : activeTab === 'clubs' ? 'Club' : 'Community';
      defaults.time = '';
      defaults.organizer = '';
      defaults.organizer_contact = '';
      defaults.center_id = '';
      defaults.center_name = '';
      defaults.capacity = '';
      defaults.image_url = '';
      defaults.is_featured = false;
      defaults.is_active = true;
      defaults.status = 'upcoming';
      defaults.duration = '';
      defaults.participants = 0;

      if (activeTab === 'education' || activeTab === 'clubs') {
        defaults.level = '';
      }

      if (activeTab === 'direct-activities') {
        defaults.votes = 0;
        defaults.target_audience = '';
      }
    }

    return defaults;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: any = { ...formData };
    
    // Process price
    if (submitData.has_price && submitData.price) {
      submitData.price = parseFloat(submitData.price);
    } else {
      submitData.price = null;
      submitData.has_price = false;
    }

    // Process numeric fields
    if (submitData.center_id) submitData.center_id = parseInt(submitData.center_id) || null;
    if (submitData.capacity) submitData.capacity = parseInt(submitData.capacity) || null;
    if (submitData.participants !== undefined) submitData.participants = parseInt(submitData.participants) || 0;
    if (submitData.votes !== undefined) submitData.votes = parseInt(submitData.votes) || 0;

    // Clean empty strings
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === '') {
        submitData[key] = null;
      }
    });

    await onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {editingItem ? 'Edit' : 'Create'} {activeTab === 'events' ? 'Event' : activeTab === 'education' ? 'Education' : activeTab === 'clubs' ? 'Club' : 'Activity'}
        </h3>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                rows={4}
              />
            </div>

            {/* Events specific: Type */}
            {activeTab === 'events' && isSuperAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="national">National</option>
                  <option value="local">Local</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            )}

            {/* Other types: Category */}
            {activeTab !== 'events' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date ? (formData.date.includes('T') ? formData.date.slice(0, 16) : `${formData.date}T${formData.time || '00:00'}`) : ''}
                onChange={(e) => {
                  const dateTime = e.target.value;
                  const [datePart, timePart] = dateTime.split('T');
                  setFormData({ 
                    ...formData, 
                    date: dateTime,
                    ...(activeTab !== 'events' && { time: timePart || '' })
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>

            {/* Time (for non-events) */}
            {activeTab !== 'events' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time || ''}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>

            {/* Attendance Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendance Type *
              </label>
              <select
                required
                value={formData.attendance_type}
                onChange={(e) => setFormData({ ...formData, attendance_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                {isSuperAdmin && <option value="online">Online</option>}
                {isSuperAdmin && <option value="hybrid">Hybrid</option>}
                <option value="in-person">In-Person</option>
              </select>
            </div>

            {/* Non-events specific fields */}
            {activeTab !== 'events' && (
              <>
                {/* Organizer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    value={formData.organizer || ''}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Organizer Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer Contact
                  </label>
                  <input
                    type="text"
                    value={formData.organizer_contact || ''}
                    onChange={(e) => setFormData({ ...formData, organizer_contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Center ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center ID
                  </label>
                  <input
                    type="number"
                    value={formData.center_id || ''}
                    onChange={(e) => setFormData({ ...formData, center_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Center Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center Name
                  </label>
                  <input
                    type="text"
                    value={formData.center_name || ''}
                    onChange={(e) => setFormData({ ...formData, center_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Participants (readonly if editing) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participants
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.participants || 0}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    readOnly={!!editingItem}
                  />
                  {editingItem && (
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated from inscriptions</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (e.g., "6 أسابيع")
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Level (Education & Clubs only) */}
                {(activeTab === 'education' || activeTab === 'clubs') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      value={formData.level || ''}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    >
                      <option value="">Select Level</option>
                      <option value="مبتدئ">مبتدئ</option>
                      <option value="متوسط">متوسط</option>
                      <option value="متقدم">متقدم</option>
                    </select>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'upcoming'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                </div>

                {/* Direct Activities specific: Votes */}
                {activeTab === 'direct-activities' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Votes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.votes || 0}
                      onChange={(e) => setFormData({ ...formData, votes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                )}

                {/* Direct Activities specific: Target Audience */}
                {activeTab === 'direct-activities' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={formData.target_audience || ''}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                )}

                {/* Is Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured || false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_featured" className="text-sm text-gray-700">
                    Featured
                  </label>
                </div>

                {/* Is Active */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </>
            )}

            {/* Price (all types) */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="has_price"
                  checked={formData.has_price || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      has_price: e.target.checked,
                      price: e.target.checked ? formData.price : '',
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="has_price" className="text-sm text-gray-700">
                  This {activeTab === 'events' ? 'event' : 'activity'} has a price
                </label>
              </div>
              {formData.has_price && (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price in DA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
