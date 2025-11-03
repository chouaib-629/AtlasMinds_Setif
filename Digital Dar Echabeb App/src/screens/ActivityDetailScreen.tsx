import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { activitiesService, ActivityDetail } from '../lib/api';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { ArrowLeft, ArrowRight, Calendar, Clock, Users, MapPin, DollarSign, Share2, Heart, MessageCircle, Phone, Send, FileText, Download, Video, Link as LinkIcon, QrCode, CheckCircle, AlertCircle, XCircle, BookOpen, GraduationCap, Upload, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/authContext';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface ActivityDetailScreenProps {
  activityId: string;
  onBack: () => void;
  onBookingComplete: (qrCode: string, activityData: ActivityDetail) => void;
  onCenterClick?: (centerId: string) => void;
}

export function ActivityDetailScreen({ activityId, onBack, onBookingComplete, onCenterClick }: ActivityDetailScreenProps) {
  const { t, language } = useApp();
  const { isAuthenticated } = useAuth();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [discussionPosts, setDiscussionPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submittedModels, setSubmittedModels] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');

  // Mock discussion posts for registered activities
  const MOCK_DISCUSSION_POSTS = [
    {
      id: '1',
      userId: '1',
      userName: 'أحمد محمد',
      text: 'هل سيتم توفير المواد قبل بداية الورشة؟',
      timestamp: '2025-11-03T10:00:00',
      likes: 5,
      replies: [],
    },
    {
      id: '2',
      userId: '2',
      userName: 'فاطمة علي',
      text: 'نعم، سيتم إرسالها عبر البريد الإلكتروني قبل يومين',
      timestamp: '2025-11-03T10:15:00',
      likes: 3,
      replies: [],
    },
    {
      id: '3',
      userId: '3',
      userName: 'محمد حسن',
      text: 'ما هي المعدات المطلوبة؟',
      timestamp: '2025-11-03T11:00:00',
      likes: 8,
      replies: [
        {
          id: '3-1',
          userId: '4',
          userName: 'سارة قاسم',
          text: 'حاسوب شخصي فقط، كل شيء آخر متوفر',
          timestamp: '2025-11-03T11:10:00',
          likes: 2,
          replies: [],
        },
      ],
    },
  ];

  // Mock resources
  const MOCK_RESOURCES = [
    {
      id: '1',
      type: 'pdf',
      title: 'دليل المبتدئين في البرمجة',
      description: 'ملف PDF شامل يغطي أساسيات البرمجة',
      url: '#',
      size: '2.5 MB',
      downloads: 142,
    },
    {
      id: '2',
      type: 'video',
      title: 'فيديو تعريفي بالورشة',
      description: 'مقدمة سريعة عن محتوى الورشة',
      url: '#',
      duration: '5 دقائق',
      views: 89,
    },
    {
      id: '3',
      type: 'link',
      title: 'موارد إضافية على الإنترنت',
      description: 'روابط لمواد تعليمية إضافية',
      url: '#',
    },
  ];

  // Initialize discussion posts if user is registered
  useEffect(() => {
    if (activity?.is_registered) {
      setDiscussionPosts(MOCK_DISCUSSION_POSTS);
    }
  }, [activity?.is_registered]);

  // Fetch activity details from backend
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('[ActivityDetailScreen] Fetching activity with ID:', activityId);
        
        // FOR NOW: Use mock data directly since API might return wrong data
        // In production, you'd fetch from API and validate the response
        const mockData = generateMockActivityFromId(activityId);
        if (mockData) {
          console.log('[ActivityDetailScreen] Using mock data for activityId:', activityId);
          console.log('[ActivityDetailScreen] Mock data title:', mockData.title);
          setActivity(mockData);
          setError(null);
        } else {
          // Only try API if mock data not available
          const data = await activitiesService.getActivityDetail(activityId);
          console.log('[ActivityDetailScreen] Activity data received from API:', data);
          
          // Validate that the API returned the correct activity
          const expectedId = activityId.split('_')[1];
          if (data.id && String(data.id) !== expectedId) {
            console.warn('[ActivityDetailScreen] API returned wrong activity! Expected ID:', expectedId, 'Got:', data.id);
            // Fall back to mock data
            const fallbackMock = generateMockActivityFromId(activityId);
            if (fallbackMock) {
              console.log('[ActivityDetailScreen] Using mock data instead due to wrong API response');
              setActivity(fallbackMock);
            } else {
              setActivity(data);
            }
          } else {
            setActivity(data);
          }
        }
      } catch (err) {
        console.error('[ActivityDetailScreen] Failed to fetch activity details:', err);
        console.error('[ActivityDetailScreen] ActivityId was:', activityId);
        
        // Use mock data as fallback if API fails
        const mockData = generateMockActivityFromId(activityId);
        if (mockData) {
          console.log('[ActivityDetailScreen] Using mock data as fallback');
          setActivity(mockData);
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load activity details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  // Generate mock activity data from ID as fallback
  const generateMockActivityFromId = (id: string): ActivityDetail | null => {
    console.log('[ActivityDetailScreen] generateMockActivityFromId called with id:', id);
    const parts = id.split('_');
    if (parts.length < 2) {
      console.error('[ActivityDetailScreen] Invalid ID format:', id);
      return null;
    }
    
    const type = parts[0] as 'education' | 'direct_activity';
    const activityId = parts.slice(1).join('_');
    console.log('[ActivityDetailScreen] Parsed - type:', type, 'activityId:', activityId);
    
    // Get the activity from InsightsScreen mock data
    const myActivities = [
      {
        id: '1',
        type: 'education',
        title: 'ورشة البرمجة للمبتدئين',
        description: 'تعلم أساسيات البرمجة مع Python في بيئة تفاعلية',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'learning',
        date: '2025-11-08',
        time: '14:00',
        duration: '120 دقيقة',
        capacity: 30,
        registered: 22,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        instructor: 'أ. محمد بن علي',
        registrationStatus: 'approved',
      },
      {
        id: '2',
        type: 'direct_activity',
        title: 'بطولة كرة القدم الخماسية',
        description: 'دوري شبابي أسبوعي',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'sports',
        date: '2025-11-10',
        time: '16:00',
        duration: '180 دقيقة',
        capacity: 40,
        registered: 35,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
        registrationStatus: 'pending',
      },
      {
        id: '4',
        type: 'education',
        title: 'ندوة القيادة الشبابية',
        description: 'لقاء تفاعلي مع قادة محليين ومتحدثين ملهمين',
        centerId: '3',
        centerName: 'دار الشباب قسنطينة',
        category: 'social',
        date: '2025-11-15',
        time: '18:00',
        duration: '90 دقيقة',
        capacity: 200,
        registered: 145,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
        registrationStatus: 'approved',
      },
      {
        id: '5',
        type: 'education',
        title: 'ورشة التصميم الجرافيكي',
        description: 'تعلم أساسيات التصميم باستخدام Adobe Photoshop',
        centerId: '2',
        centerName: 'دار الشباب وهران',
        category: 'learning',
        date: '2025-11-17',
        time: '15:00',
        duration: '120 دقيقة',
        capacity: 100,
        registered: 87,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
        registrationStatus: 'attended',
      },
      {
        id: '6',
        type: 'education',
        title: 'دورة التصوير الفوتوغرافي',
        description: 'تعلم فن التصوير الاحترافي',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'learning',
        date: '2025-11-20',
        time: '14:00',
        duration: '150 دقيقة',
        capacity: 60,
        registered: 52,
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop',
        registrationStatus: 'pending',
      },
      {
        id: '7',
        type: 'education',
        title: 'ورشة الحرف اليدوية التقليدية',
        description: 'تعلم صناعة الحرف اليدوية التقليدية الجزائرية والإبداع في التصاميم الفنية',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'arts',
        date: '2025-11-22',
        time: '16:00',
        duration: '180 دقيقة',
        capacity: 40,
        registered: 38,
        image: 'https://static.vecteezy.com/system/resources/previews/055/401/439/non_2x/creative-handcraft-art-class-concept-background-top-view-colorful-hands-create-handmade-knitting-craftwork-children-handicraft-origami-activity-illustration-diy-workshop-hobby-banner-vector.jpg',
        instructor: 'أ. فاطمة الزهراء',
        registrationStatus: 'approved',
        allowsSubmissions: true,
      },
      // Upcoming in Area
      {
        id: '1',
        type: 'education',
        title: 'ورشة البرمجة للمبتدئين',
        description: 'تعلم أساسيات البرمجة مع Python في بيئة تفاعلية',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'learning',
        date: '2025-11-08',
        time: '14:00',
        duration: '120 دقيقة',
        capacity: 30,
        registered: 22,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        registrationStatus: undefined,
      },
      {
        id: '2',
        type: 'direct_activity',
        title: 'بطولة كرة القدم الخماسية',
        description: 'دوري شبابي أسبوعي',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'sports',
        date: '2025-11-10',
        time: '16:00',
        duration: '180 دقيقة',
        capacity: 40,
        registered: 35,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
        registrationStatus: undefined,
      },
      // Recommended Events
      {
        id: '5',
        type: 'direct_activity',
        title: 'بطولة الرياضات الإلكترونية',
        description: 'منافسة في الألعاب الإلكترونية',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'e-sport',
        date: '2025-11-20',
        time: '15:00',
        duration: '180 دقيقة',
        capacity: 32,
        registered: 28,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
        registrationStatus: undefined,
      },
      {
        id: '3',
        type: 'direct_activity',
        title: 'حملة تنظيف الشاطئ',
        description: 'مبادرة بيئية لتنظيف الشواطئ المحلية',
        centerId: '2',
        centerName: 'دار الشباب وهران',
        category: 'environmental',
        date: '2025-11-12',
        time: '08:00',
        duration: '240 دقيقة',
        capacity: 50,
        registered: 18,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
        registrationStatus: undefined,
      },
    ];
    
    // CRITICAL: Match by FULL ID ONLY (type_id) - this ensures correct activity
    // Example: "education_1" must match exactly with an activity that has type='education' and id='1'
    console.log('[ActivityDetailScreen] Searching for activity with full ID:', id);
    console.log('[ActivityDetailScreen] Available activities:', myActivities.map(a => `"${a.type}_${a.id}" -> ${a.title}`));
    
    const found = myActivities.find(a => {
      const fullId = `${a.type}_${a.id}`;
      const matches = fullId === id;
      if (matches) {
        console.log('[ActivityDetailScreen] ✅ FOUND MATCH:', fullId, '=', id, 'Title:', a.title);
      }
      return matches;
    });
    
    if (!found) {
      console.error('[ActivityDetailScreen] ❌ NO MATCH FOUND for full ID:', id);
      console.error('[ActivityDetailScreen] Searched type:', type, 'activityId:', activityId);
      console.error('[ActivityDetailScreen] Available full IDs:', myActivities.map(a => `${a.type}_${a.id}`));
      return null;
    }
    
    console.log('[ActivityDetailScreen] ✅ MATCH FOUND - Activity:', found.title);
    
    return {
      id: parseInt(found.id),
      type: found.type as 'education' | 'direct_activity',
      title: found.title,
      description: found.description,
      category: found.category,
      date: found.date,
      time: found.time,
      duration: found.duration,
      location: found.centerName,
      attendance_type: 'physical',
      organizer: found.instructor || 'دار الشباب',
      organizer_contact: '+213550000000',
      center_id: found.centerId,
      center_name: found.centerName,
      has_price: false,
      price: null,
      participants: found.registered,
      capacity: found.capacity,
      image_url: found.image,
      is_registered: found.registrationStatus !== undefined,
      registration_status: found.registrationStatus as 'pending' | 'approved' | 'rejected' | 'attended' | undefined,
      allowsSubmissions: found.allowsSubmissions || false,
    };
  };

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  // Determine button text based on activity type/category
  const getButtonText = () => {
    if (!activity) return t('احجز الآن', 'Book Now');
    
    // Determine category from activity type or category field
    const activityType = activity.type;
    const category = activity.category?.toLowerCase() || '';
    
    // Events (from home page events section)
    if (activityType === 'education' || activityType === 'club' || category.includes('workshop') || category.includes('training')) {
      return t('سجل الآن', 'Register Now');
    }
    
    // Community projects (direct activities)
    if (activityType === 'direct_activity' || category.includes('volunteer') || category.includes('community')) {
      return t('انضم الآن', 'Join Now');
    }
    
    // Default: Book/Reserve
    return t('احجز الآن', 'Book Now');
  };

  // Determine category color
  const getCategoryColor = () => {
    if (!activity) return 'from-blue-500 to-blue-600';
    
    const category = activity.category?.toLowerCase() || '';
    if (category.includes('workshop') || category.includes('training') || category.includes('course')) {
      return 'from-purple-500 to-purple-600';
    }
    if (category.includes('volunteer') || category.includes('community')) {
      return 'from-green-500 to-green-600';
    }
    if (category.includes('club')) {
      return 'from-orange-500 to-orange-600';
    }
    return 'from-blue-500 to-blue-600';
  };

  const handleJoin = () => {
    if (!isAuthenticated) {
      toast.error(t('يرجى تسجيل الدخول أولاً', 'Please login first'));
      return;
    }

    // Check if already registered
    if (activity.is_registered) {
      const statusText = activity.registration_status === 'pending' 
        ? t('قيد الانتظار', 'Pending')
        : activity.registration_status === 'approved'
        ? t('موافق عليه', 'Approved')
        : activity.registration_status === 'rejected'
        ? t('مرفوض', 'Rejected')
        : t('حاضر', 'Attended');
      
      toast.info(t('أنت مسجل بالفعل', 'You are already registered') + ` (${statusText})`);
      return;
    }

    setShowBookingModal(true);
  };

  const handleConfirmJoin = async () => {
    if (!activity) return;
    
    setShowBookingModal(false);
    
    // Check if payment is required
    if (activity.has_price && activity.price) {
      setShowPaymentModal(true);
      return;
    }
    
    // Proceed with registration
    await completeJoin();
  };

  const handlePaymentComplete = async () => {
    setShowPaymentModal(false);
    await completeJoin();
  };

  const completeJoin = async () => {
    if (!activity) return;
    
    try {
      setIsJoining(true);
      const result = await activitiesService.joinActivity(activityId);
      
      // Refresh activity data to get updated registration status
      const updatedActivity = await activitiesService.getActivityDetail(activityId);
      setActivity(updatedActivity);
      
      setBookingConfirmed(true);
      const qrCode = `DAR-${updatedActivity.type}-${updatedActivity.id}-${Date.now()}`;
      toast.success(t('تم التسجيل بنجاح!', 'Successfully registered!'));
      
      setTimeout(() => {
        onBookingComplete(qrCode, updatedActivity);
      }, 1500);
    } catch (err) {
      console.error('Failed to join activity:', err);
      const errorMessage = err instanceof Error ? err.message : t('فشل التسجيل', 'Registration failed');
      toast.error(errorMessage);
      
      // If user is already registered, refresh activity to show status
      if (errorMessage.includes('already registered')) {
        try {
          const updatedActivity = await activitiesService.getActivityDetail(activityId);
          setActivity(updatedActivity);
        } catch (refreshErr) {
          console.error('Failed to refresh activity:', refreshErr);
        }
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleContactOrganizer = (contact: string) => {
    window.open(`tel:${contact}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || t('النشاط غير موجود', 'Activity not found')}</p>
          <Button onClick={onBack} variant="outline">
            {t('العودة', 'Go Back')}
          </Button>
        </div>
      </div>
    );
  }

  const isFull = activity.capacity ? activity.participants >= activity.capacity : false;
  const buttonText = getButtonText();
  const categoryColor = getCategoryColor();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Hero Image */}
      <div className={`relative h-64 bg-gradient-to-br ${categoryColor}`}>
        {activity.image_url ? (
          <img 
            src={activity.image_url} 
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <BackIcon className="w-6 h-6" />
        </button>
        
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm">
            <Heart className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Status Badge */}
        {activity.status === 'live' && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
            {t('مباشر', 'LIVE')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Title & Meta */}
          <div className="space-y-3">
            <h1>{activity.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {onCenterClick && activity.center_id ? (
                  <button
                    onClick={() => onCenterClick(activity.center_id)}
                    className="hover:underline"
                  >
                    {activity.center_name}
                  </button>
                ) : (
                  <span>{activity.center_name}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{activity.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{activity.time}</span>
                {activity.duration && (
                  <span className="text-xs">({activity.duration})</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{activity.participants}/{activity.capacity || '∞'}</span>
              </div>

              {activity.has_price && activity.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{activity.price} {t('دج', 'DZD')}</span>
                </div>
              )}

              {activity.level && (
                <div className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded text-xs">
                  {activity.level}
                </div>
              )}

              {activity.target_audience && (
                <div className="text-xs opacity-75">
                  {activity.target_audience}
                </div>
              )}
            </div>

            {activity.organizer_contact && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <button
                  onClick={() => handleContactOrganizer(activity.organizer_contact)}
                  className="text-sm text-primary hover:underline"
                >
                  {activity.organizer_contact}
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">{t('حول', 'About')}</TabsTrigger>
              <TabsTrigger value="resources">
                {t('موارد', 'Resources')}
                {activity.is_registered && MOCK_RESOURCES.length > 0 && (
                  <Badge variant="secondary" className="mr-2 h-4 min-w-[16px] px-1 text-[10px]">
                    {MOCK_RESOURCES.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="discussion">
                <MessageCircle className="w-4 h-4 mr-1" />
                {t('نقاش', 'Discussion')}
                {activity.is_registered && discussionPosts.length > 0 && (
                  <Badge variant="secondary" className="mr-2 h-4 min-w-[16px] px-1 text-[10px]">
                    {discussionPosts.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <div>
                <h4 className="mb-2">{t('الوصف', 'Description')}</h4>
                <p className="text-muted-foreground">{activity.description}</p>
              </div>

              {activity.organizer && (
                <div>
                  <h4 className="mb-2">{t('المنظم', 'Organizer')}</h4>
                  <p className="text-muted-foreground">{activity.organizer}</p>
                </div>
              )}

              {activity.level && (
                <div>
                  <h4 className="mb-2">{t('المستوى', 'Level')}</h4>
                  <p className="text-muted-foreground">{activity.level}</p>
                </div>
              )}

            {activity.duration && (
              <div>
                <h4 className="mb-2">{t('المدة', 'Duration')}</h4>
                <p className="text-muted-foreground">{activity.duration}</p>
              </div>
            )}

            {activity.target_audience && (
              <div>
                <h4 className="mb-2">{t('الجمهور المستهدف', 'Target Audience')}</h4>
                <p className="text-muted-foreground">{activity.target_audience}</p>
              </div>
            )}

            {activity.location && activity.location !== activity.center_name && (
              <div>
                <h4 className="mb-2">{t('الموقع', 'Location')}</h4>
                <p className="text-muted-foreground">{activity.location}</p>
              </div>
            )}

            {activity.attendance_type && (
              <div>
                <h4 className="mb-2">{t('نوع الحضور', 'Attendance Type')}</h4>
                <Badge variant="outline">
                  {activity.attendance_type === 'physical' ? t('حضوري', 'Physical', 'Présentiel') :
                   activity.attendance_type === 'virtual' ? t('افتراضي', 'Virtual', 'Virtuel') :
                   t('مختلط', 'Hybrid', 'Hybride')}
                </Badge>
              </div>
            )}

            {/* Registration Info for Registered Users */}
            {activity.is_registered && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {t('معلومات التسجيل', 'Registration Info')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('حالة التسجيل', 'Registration Status')}</span>
                    <Badge className={
                      activity.registration_status === 'approved' ? 'bg-green-600 text-white' :
                      activity.registration_status === 'pending' ? 'bg-yellow-500 text-white' :
                      activity.registration_status === 'attended' ? 'bg-blue-600 text-white' :
                      activity.registration_status === 'rejected' ? 'bg-red-600 text-white' :
                      'bg-gray-600 text-white'
                    }>
                      {activity.registration_status === 'approved' ? t('موافق عليه', 'Approved') :
                       activity.registration_status === 'pending' ? t('قيد الانتظار', 'Pending') :
                       activity.registration_status === 'attended' ? t('حاضر', 'Attended') :
                       activity.registration_status === 'rejected' ? t('مرفوض', 'Rejected') :
                       t('مسجل', 'Registered')}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Model Submission Section for Handcraft Workshop */}
            {activity.is_registered && activity.registration_status === 'approved' && (activity.allowsSubmissions || activity.title?.includes('الحرف اليدوية')) && (
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="mb-2 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      {t('تقديم أعمالك', 'Submit Your Work', 'Soumettre vos travaux')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('شارك نماذجك من الحرف اليدوية مع المدرب والمشاركين الآخرين', 'Share your handcraft models with the instructor and other participants', 'Partagez vos modèles artisanaux avec l\'instructeur et les autres participants')}
                    </p>
                  </div>
                </div>

                {submittedModels.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <h5 className="text-sm font-semibold">{t('أعمالك المقدمة', 'Your Submitted Works', 'Vos travaux soumis')}</h5>
                    {submittedModels.map((model, index) => (
                      <Card key={index} className="p-3 bg-background">
                        <div className="flex items-start gap-3">
                          {model.images && model.images.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {model.images.map((img: string, imgIdx: number) => (
                                <div key={imgIdx} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                  <img src={img} alt={`Model ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex-1">
                            <h6 className="font-semibold text-sm mb-1">{model.title}</h6>
                            {model.description && (
                              <p className="text-xs text-muted-foreground mb-2">{model.description}</p>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {t('تم التقديم', 'Submitted', 'Soumis')}: {new Date(model.submittedAt).toLocaleDateString('ar-DZ')}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => setShowSubmissionModal(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {submittedModels.length > 0 
                    ? t('تقديم عمل جديد', 'Submit New Work', 'Soumettre un nouveau travail')
                    : t('تقديم نموذج', 'Submit Model', 'Soumettre un modèle')}
                </Button>
              </Card>
            )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-3">
              {!activity.is_registered ? (
                <Card className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-2">
                    {t('الموارد متاحة بعد التسجيل', 'Resources available after registration')}
                  </p>
                  <p className="text-sm text-muted-foreground opacity-75">
                    {t('سجل في النشاط للوصول إلى جميع الموارد', 'Register for the activity to access all resources')}
                  </p>
                </Card>
              ) : MOCK_RESOURCES.length === 0 ? (
                <Card className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {t('لا توجد موارد متاحة حالياً', 'No resources available at the moment')}
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {MOCK_RESOURCES.map((resource) => {
                    const getResourceIcon = () => {
                      switch (resource.type) {
                        case 'pdf':
                          return FileText;
                        case 'video':
                          return Video;
                        case 'link':
                          return LinkIcon;
                        default:
                          return FileText;
                      }
                    };

                    const ResourceIcon = getResourceIcon();

                    return (
                      <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <ResourceIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold mb-1">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {resource.size && <span>{resource.size}</span>}
                              {resource.duration && <span>{resource.duration}</span>}
                              {resource.downloads && (
                                <span>{resource.downloads} {t('تحميل', 'downloads')}</span>
                              )}
                              {resource.views && (
                                <span>{resource.views} {t('مشاهدة', 'views')}</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast.info(t('جارٍ التحميل...', 'Downloading...'));
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t('تحميل', 'Download')}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="discussion" className="flex flex-col h-[400px] min-h-[300px]">
              {!activity.is_registered ? (
                <div className="flex items-center justify-center h-full">
                  <Card className="p-6 text-center max-w-md">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-2">
                      {t('انضم للنقاش بعد التسجيل', 'Join discussion after registration')}
                    </p>
                    <p className="text-sm text-muted-foreground opacity-75">
                      {t('سجل في النشاط للوصول إلى منتدى النقاش', 'Register for the activity to access the discussion forum')}
                    </p>
                  </Card>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 px-1">
                    <div className="space-y-4 py-4">
                      {discussionPosts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>{t('لا توجد منشورات بعد', 'No posts yet')}</p>
                        </div>
                      ) : (
                        discussionPosts.map((post) => (
                          <Card key={post.id} className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm">{post.userName}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(post.timestamp).toLocaleDateString('ar-DZ', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm mb-3 whitespace-pre-wrap">{post.text}</p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                                    <Heart className="w-3 h-3" />
                                    <span>{post.likes}</span>
                                  </button>
                                  <button
                                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                                    className="text-xs text-muted-foreground hover:text-primary"
                                  >
                                    {t('رد', 'Reply')}
                                  </button>
                                </div>

                                {/* Reply Input */}
                                {replyingTo === post.id && (
                                  <div className="mt-3 flex gap-2">
                                    <Input
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder={t('اكتب رداً...', 'Write a reply...')}
                                      className="text-sm"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        if (!replyText.trim()) return;
                                        const newReply = {
                                          id: `reply-${Date.now()}`,
                                          userId: 'me',
                                          userName: t('أنت', 'You'),
                                          text: replyText,
                                          timestamp: new Date().toISOString(),
                                          likes: 0,
                                          replies: [],
                                        };
                                        setDiscussionPosts(discussionPosts.map(p => {
                                          if (p.id === post.id) {
                                            return { ...p, replies: [...p.replies, newReply] };
                                          }
                                          return p;
                                        }));
                                        setReplyText('');
                                        setReplyingTo(null);
                                        toast.success(t('تم إرسال الرد', 'Reply sent'));
                                      }}
                                      disabled={!replyText.trim()}
                                    >
                                      <Send className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}

                                {/* Replies */}
                                {post.replies && post.replies.length > 0 && (
                                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-border">
                                    {post.replies.map((reply: any) => (
                                      <div key={reply.id} className="flex items-start gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                          <Users className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-medium text-xs">{reply.userName}</h5>
                                            <span className="text-xs text-muted-foreground">
                                              {new Date(reply.timestamp).toLocaleDateString('ar-DZ', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                              })}
                                            </span>
                                          </div>
                                          <p className="text-xs">{reply.text}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {/* New Post Input */}
                  <div className="p-4 border-t border-border bg-card">
                    <div className="flex gap-2">
                      <Input
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder={t('اكتب منشوراً جديداً...', 'Write a new post...')}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (!newPostText.trim()) return;
                            const newPost = {
                              id: `post-${Date.now()}`,
                              userId: 'me',
                              userName: t('أنت', 'You'),
                              text: newPostText,
                              timestamp: new Date().toISOString(),
                              likes: 0,
                              replies: [],
                            };
                            setDiscussionPosts([newPost, ...discussionPosts]);
                            setNewPostText('');
                            toast.success(t('تم إرسال المنشور', 'Post sent'));
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (!newPostText.trim()) return;
                          const newPost = {
                            id: `post-${Date.now()}`,
                            userId: 'me',
                            userName: t('أنت', 'You'),
                            text: newPostText,
                            timestamp: new Date().toISOString(),
                            likes: 0,
                            replies: [],
                          };
                          setDiscussionPosts([newPost, ...discussionPosts]);
                          setNewPostText('');
                          toast.success(t('تم إرسال المنشور', 'Post sent'));
                        }}
                        disabled={!newPostText.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* QR Code Display for Registered Users */}
      {activity.is_registered && activity.registration_status === 'approved' && (
        <div className="p-4 border-t border-border bg-primary/5">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{t('تذكرتك', 'Your Ticket')}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('اعرض رمز QR عند الوصول', 'Show QR code upon arrival')}
                </p>
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {`DAR-${activity.type}-${activity.id}-${Date.now()}`}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success(t('تم فتح تذكرتك', 'Ticket opened'));
                }}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {t('عرض', 'Show')}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="p-4 border-t border-border bg-background">
        {activity.is_registered || bookingConfirmed ? (
          <div className="space-y-2">
            <Button className="w-full" size="lg" disabled>
              {activity.registration_status === 'approved' 
                ? t('موافق عليه ✓', 'Approved ✓')
                : activity.registration_status === 'pending'
                ? t('قيد الانتظار...', 'Pending...')
                : activity.registration_status === 'rejected'
                ? t('مرفوض', 'Rejected')
                : activity.registration_status === 'attended'
                ? t('حاضر ✓', 'Attended ✓')
                : t('تم التسجيل ✓', 'Registered ✓')}
            </Button>
            {activity.registration_status === 'pending' && (
              <p className="text-xs text-center text-muted-foreground">
                {t('في انتظار الموافقة من المسؤول', 'Waiting for admin approval')}
              </p>
            )}
          </div>
        ) : isFull ? (
          <Button className="w-full" size="lg" variant="secondary" disabled>
            {t('ممتلئ', 'Full')}
          </Button>
        ) : (
          <Button 
            onClick={handleJoin} 
            className="w-full" 
            size="lg"
            disabled={isJoining || !isAuthenticated}
          >
            {!isAuthenticated 
              ? t('سجل الدخول للتسجيل', 'Login to Register')
              : isJoining 
              ? t('جاري التسجيل...', 'Registering...') 
              : buttonText}
          </Button>
        )}
      </div>

      {/* Booking/Join Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('تأكيد التسجيل', 'Confirm Registration')}</DialogTitle>
            <DialogDescription>
              {t('هل تريد تأكيد تسجيلك في هذا النشاط؟', 'Do you want to confirm your registration for this activity?')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p>{activity.title}</p>
              <p className="text-muted-foreground">{activity.date} - {activity.time}</p>
              {activity.has_price && activity.price && (
                <p className="text-primary">{activity.price} {t('دج', 'DZD')}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button onClick={handleConfirmJoin} className="flex-1" disabled={isJoining}>
                {isJoining ? t('جاري...', 'Processing...') : t('تأكيد', 'Confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('الدفع', 'Payment')}</DialogTitle>
            <DialogDescription>
              {t('إتمام عملية الدفع', 'Complete payment process')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-6 bg-muted rounded-lg text-center space-y-3">
              <p className="text-muted-foreground">
                {t('محاكاة الدفع', 'Payment Simulation')}
              </p>
              <div className="text-3xl">💳</div>
              {activity.price && (
                <p>{activity.price} {t('دج', 'DZD')}</p>
              )}
            </div>

            <Button onClick={handlePaymentComplete} className="w-full" size="lg" disabled={isJoining}>
              {isJoining ? t('جاري المعالجة...', 'Processing...') : t('دفع الآن', 'Pay Now')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Model Submission Modal */}
      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('تقديم نموذج', 'Submit Model', 'Soumettre un modèle')}</DialogTitle>
            <DialogDescription>
              {t('قم بتحميل صور لنماذجك من الحرف اليدوية', 'Upload images of your handcraft models', 'Téléchargez des images de vos modèles artisanaux')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('عنوان النموذج', 'Model Title', 'Titre du modèle')}
              </label>
              <Input
                value={submissionTitle}
                onChange={(e) => setSubmissionTitle(e.target.value)}
                placeholder={t('مثال: سلة تقليدية منسوجة يدوياً', 'Example: Traditional handwoven basket', 'Exemple: Panier traditionnel tissé à la main')}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('الوصف', 'Description', 'Description')}
              </label>
              <textarea
                value={submissionDescription}
                onChange={(e) => setSubmissionDescription(e.target.value)}
                placeholder={t('وصف قصير عن النموذج والتقنيات المستخدمة...', 'Brief description of the model and techniques used...', 'Brève description du modèle et des techniques utilisées...')}
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('صور النموذج', 'Model Images', 'Images du modèle')} ({selectedImages.length}/5)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 5);
                    setSelectedImages(prev => [...prev, ...files].slice(0, 5));
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {t('انقر لاختيار الصور', 'Click to select images', 'Cliquez pour sélectionner des images')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('الحد الأقصى 5 صور', 'Maximum 5 images', 'Maximum 5 images')}
                  </p>
                </label>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {selectedImages.map((file, index) => {
                    const preview = URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setSelectedImages(prev => {
                              const newImages = prev.filter((_, i) => i !== index);
                              URL.revokeObjectURL(preview);
                              return newImages;
                            });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSubmissionModal(false);
                  setSelectedImages([]);
                  setSubmissionTitle('');
                  setSubmissionDescription('');
                  // Clean up object URLs
                  selectedImages.forEach(file => {
                    const preview = URL.createObjectURL(file);
                    URL.revokeObjectURL(preview);
                  });
                }}
                className="flex-1"
              >
                {t('إلغاء', 'Cancel', 'Annuler')}
              </Button>
              <Button
                onClick={() => {
                  if (!submissionTitle.trim() || selectedImages.length === 0) {
                    toast.error(t('يرجى إدخال العنوان واختيار صورة واحدة على الأقل', 'Please enter a title and select at least one image', 'Veuillez entrer un titre et sélectionner au moins une image'));
                    return;
                  }

                  const imageUrls = selectedImages.map(file => URL.createObjectURL(file));
                  
                  const newSubmission = {
                    title: submissionTitle,
                    description: submissionDescription,
                    images: imageUrls,
                    submittedAt: new Date().toISOString(),
                  };

                  setSubmittedModels(prev => [newSubmission, ...prev]);
                  setShowSubmissionModal(false);
                  
                  // Clean up
                  const prevImages = [...selectedImages];
                  setSelectedImages([]);
                  setSubmissionTitle('');
                  setSubmissionDescription('');
                  
                  toast.success(t('تم تقديم النموذج بنجاح!', 'Model submitted successfully!', 'Modèle soumis avec succès !'));
                }}
                className="flex-1"
                disabled={!submissionTitle.trim() || selectedImages.length === 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t('تقديم', 'Submit', 'Soumettre')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
