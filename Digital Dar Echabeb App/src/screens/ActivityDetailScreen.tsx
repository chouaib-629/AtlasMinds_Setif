import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { activitiesService, ActivityDetail } from '../lib/api';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { ArrowLeft, ArrowRight, Calendar, Clock, Users, MapPin, DollarSign, Share2, Heart, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/authContext';

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

  // Fetch activity details from backend
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await activitiesService.getActivityDetail(activityId);
        setActivity(data);
      } catch (err) {
        console.error('Failed to fetch activity details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load activity details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

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
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">{t('حول', 'About')}</TabsTrigger>
              <TabsTrigger value="resources">{t('موارد', 'Resources')}</TabsTrigger>
              <TabsTrigger value="discussion">{t('نقاش', 'Discussion')}</TabsTrigger>
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
            </TabsContent>

            <TabsContent value="resources" className="space-y-3">
              <p className="text-muted-foreground">
                {t('الموارد متاحة بعد التسجيل', 'Resources available after registration')}
              </p>
            </TabsContent>

            <TabsContent value="discussion" className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t('انضم للنقاش بعد التسجيل', 'Join discussion after registration')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
    </div>
  );
}
