import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockActivities } from '../lib/data';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { ArrowLeft, ArrowRight, Calendar, Clock, Users, MapPin, DollarSign, Share2, Heart, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface ActivityDetailScreenProps {
  activityId: string;
  onBack: () => void;
  onBookingComplete: (qrCode: string) => void;
  onCenterClick?: (centerId: string) => void;
}

export function ActivityDetailScreen({ activityId, onBack, onBookingComplete, onCenterClick }: ActivityDetailScreenProps) {
  const { t, language } = useApp();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const activity = mockActivities.find(a => a.id === activityId);
  if (!activity) return null;

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const categoryColors = {
    sports: 'from-blue-500 to-blue-600',
    learning: 'from-purple-500 to-purple-600',
    social: 'from-pink-500 to-pink-600',
    environmental: 'from-green-500 to-green-600',
    'e-sport': 'from-orange-500 to-orange-600',
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    setShowBookingModal(false);
    if (activity.type === 'paid') {
      setShowPaymentModal(true);
    } else {
      completeBooking();
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    completeBooking();
  };

  const completeBooking = () => {
    setBookingConfirmed(true);
    const qrCode = `DAR-${activity.id}-${Date.now()}`;
    toast.success(t('تم الحجز بنجاح!', 'Booking confirmed!'));
    setTimeout(() => {
      onBookingComplete(qrCode);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Hero Image */}
      <div className={`relative h-64 bg-gradient-to-br ${categoryColors[activity.category]}`}>
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
                {onCenterClick && activity.centerId ? (
                  <button
                    onClick={() => onCenterClick(activity.centerId)}
                    className="hover:underline"
                  >
                    {activity.centerName}
                  </button>
                ) : (
                  <span>{activity.centerName}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{activity.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{activity.time} ({activity.duration} {t('دقيقة', 'min')})</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{activity.registered}/{activity.capacity}</span>
              </div>

              {activity.type === 'paid' && activity.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{activity.price} {t('دج', 'DZD')}</span>
                </div>
              )}
            </div>
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

              {activity.instructor && (
                <div>
                  <h4 className="mb-2">{t('المدرب', 'Instructor')}</h4>
                  <p className="text-muted-foreground">{activity.instructor}</p>
                </div>
              )}

              <div>
                <h4 className="mb-2">{t('ماذا ستتعلم', 'What you will learn')}</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>{t('أساسيات الموضوع', 'Fundamentals of the topic')}</li>
                  <li>{t('تطبيقات عملية', 'Practical applications')}</li>
                  <li>{t('مشاريع يدوية', 'Hands-on projects')}</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-3">
              <p className="text-muted-foreground">
                {t('الموارد متاحة بعد التسجيل', 'Resources available after registration')}
              </p>
              <div className="space-y-2">
                {['دليل المشارك', 'ملفات PDF', 'روابط مفيدة'].map((item, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg">
                    <p>{item}</p>
                  </div>
                ))}
              </div>
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
        {bookingConfirmed ? (
          <Button className="w-full" size="lg" disabled>
            {t('تم الحجز ✓', 'Booked ✓')}
          </Button>
        ) : activity.registered >= activity.capacity ? (
          <Button className="w-full" size="lg" variant="secondary">
            {t('انضم لقائمة الانتظار', 'Join Waitlist')}
          </Button>
        ) : (
          <Button onClick={handleBookNow} className="w-full" size="lg">
            {t('احجز الآن', 'Book Now')}
          </Button>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('تأكيد الحجز', 'Confirm Booking')}</DialogTitle>
            <DialogDescription>
              {t('هل تريد تأكيد حجزك لهذا النشاط؟', 'Do you want to confirm your booking for this activity?')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p>{activity.title}</p>
              <p className="text-muted-foreground">{activity.date} - {activity.time}</p>
              {activity.type === 'paid' && activity.price && (
                <p className="text-primary">{activity.price} {t('دج', 'DZD')}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button onClick={handleConfirmBooking} className="flex-1">
                {t('تأكيد', 'Confirm')}
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
              <p>{activity.price} {t('دج', 'DZD')}</p>
            </div>

            <Button onClick={handlePaymentComplete} className="w-full" size="lg">
              {t('دفع الآن', 'Pay Now')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
