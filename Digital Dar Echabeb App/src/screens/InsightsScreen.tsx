import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ActivityCard } from '../components/ActivityCard';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight, 
  Trophy,
  MessageCircle,
  ChevronLeft,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface InsightsScreenProps {
  onCenterClick: (centerId: string) => void;
  onActivityClick: (activityId: string) => void;
  onQuestsClick: () => void;
  onChatsClick: () => void;
}

export function InsightsScreen({ 
  onCenterClick, 
  onActivityClick,
  onQuestsClick,
  onChatsClick 
}: InsightsScreenProps) {
  const { t, language } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - in real app would come from context/API
  const registeredCenter = {
    id: '1',
    name: 'دار الشباب المركزي',
    wilaya: 'الجزائر',
    address: 'حي بئر مراد رايس',
    memberCount: 450,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
  };

    const upcomingInArea = [
      {
        id: '1',
        type: 'education',
        title: 'ورشة البرمجة للمبتدئين',
        centerName: 'دار الشباب المركزي',
        category: 'learning',
        date: '2025-11-08',
        time: '14:00',
        registered: 22,
        capacity: 30,
      },
      {
        id: '2',
        type: 'direct_activity',
        title: 'بطولة كرة القدم الخماسية',
        centerName: 'دار الشباب المركزي',
        category: 'sports',
        date: '2025-11-10',
        time: '16:00',
        registered: 35,
        capacity: 40,
      },
    ];

    const recommendedEvents = [
      {
        id: '5',
        type: 'direct_activity',
        title: 'بطولة الرياضات الإلكترونية',
        centerName: 'دار الشباب المركزي',
        category: 'e-sport',
        date: '2025-11-20',
        time: '15:00',
        registered: 28,
        capacity: 32,
        matchScore: 95,
      },
      {
        id: '3',
        type: 'direct_activity',
        title: 'حملة تنظيف الشاطئ',
        centerName: 'دار الشباب وهران',
        category: 'environmental',
        date: '2025-11-12',
        time: '08:00',
        registered: 18,
        capacity: 50,
        matchScore: 87,
      },
    ];

  const upcomingPrograms = [
    { day: 'الإثنين', time: '14:00 - 16:00', title: 'ورشة البرمجة', category: 'learning' },
    { day: 'الثلاثاء', time: '16:00 - 18:00', title: 'تدريب كرة القدم', category: 'sports' },
    { day: 'الأربعاء', time: '10:00 - 12:00', title: 'نادي الكتاب', category: 'social' },
    { day: 'الخميس', time: '15:00 - 17:00', title: 'بطولة FIFA', category: 'e-sport' },
    { day: 'الجمعة', time: '09:00 - 11:00', title: 'يوغا للمبتدئين', category: 'sports' },
  ];

  // User's registered activities and workshops
  const myActivities = [
    {
      id: '1',
      title: 'ورشة البرمجة للمبتدئين',
      description: 'تعلم أساسيات البرمجة مع Python في بيئة تفاعلية',
      centerId: '1',
      centerName: 'دار الشباب المركزي',
      category: 'learning',
      type: 'education',
      date: '2025-11-08',
      time: '14:00',
      duration: '120 دقيقة',
      capacity: 30,
      registered: 22,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      instructor: 'أ. محمد بن علي',
      registrationStatus: 'approved',
      registrationDate: '2025-10-25',
      qrCode: 'DAR-EDUCATION-1-12345',
      hasResources: true,
      price: null,
      hasPrice: false,
    },
    {
      id: '2',
      title: 'بطولة كرة القدم الخماسية',
      description: 'دوري شبابي أسبوعي',
      centerId: '1',
      centerName: 'دار الشباب المركزي',
      category: 'sports',
      type: 'direct_activity',
      date: '2025-11-10',
      time: '16:00',
      duration: '180 دقيقة',
      capacity: 40,
      registered: 35,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
      registrationStatus: 'pending',
      registrationDate: '2025-11-01',
      qrCode: 'DAR-ACTIVITY-2-67890',
      hasResources: false,
      price: 500,
      hasPrice: true,
      paymentStatus: 'completed',
    },
    {
      id: '4',
      title: 'ندوة القيادة الشبابية',
      description: 'لقاء تفاعلي مع قادة محليين ومتحدثين ملهمين',
      centerId: '3',
      centerName: 'دار الشباب قسنطينة',
      category: 'social',
      type: 'education',
      date: '2025-11-15',
      time: '18:00',
      duration: '90 دقيقة',
      capacity: 200,
      registered: 145,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      registrationStatus: 'approved',
      registrationDate: '2025-10-20',
      qrCode: 'DAR-EDUCATION-4-54321',
      hasResources: true,
      price: null,
      hasPrice: false,
    },
    {
      id: '5',
      title: 'ورشة التصميم الجرافيكي',
      description: 'تعلم أساسيات التصميم باستخدام Adobe Photoshop',
      centerId: '2',
      centerName: 'دار الشباب وهران',
      category: 'learning',
      type: 'education',
      date: '2025-11-17',
      time: '15:00',
      duration: '120 دقيقة',
      capacity: 100,
      registered: 87,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
      instructor: 'أ. سارة بن علي',
      registrationStatus: 'attended',
      registrationDate: '2025-09-15',
      qrCode: 'DAR-EDUCATION-5-98765',
      hasResources: true,
      price: null,
      hasPrice: false,
      attendanceDate: '2025-11-10',
    },
      {
        id: '6',
        title: 'دورة التصوير الفوتوغرافي',
        description: 'تعلم فن التصوير الاحترافي',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'learning',
        type: 'education',
        date: '2025-11-20',
        time: '14:00',
        duration: '150 دقيقة',
        capacity: 60,
        registered: 52,
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop',
        instructor: 'أ. نور الدين',
        registrationStatus: 'pending',
        registrationDate: '2025-11-03',
        qrCode: null,
        hasResources: false,
        price: null,
        hasPrice: false,
      },
      {
        id: '7',
        title: 'ورشة الحرف اليدوية التقليدية',
        description: 'تعلم صناعة الحرف اليدوية التقليدية الجزائرية والإبداع في التصاميم الفنية',
        centerId: '1',
        centerName: 'دار الشباب المركزي',
        category: 'arts',
        type: 'education',
        date: '2025-11-22',
        time: '16:00',
        duration: '180 دقيقة',
        capacity: 40,
        registered: 38,
        image: 'https://static.vecteezy.com/system/resources/previews/055/401/439/non_2x/creative-handcraft-art-class-concept-background-top-view-colorful-hands-create-handmade-knitting-craftwork-children-handicraft-origami-activity-illustration-diy-workshop-hobby-banner-vector.jpg',
        instructor: 'أ. فاطمة الزهراء',
        registrationStatus: 'approved',
        registrationDate: '2025-10-28',
        qrCode: 'DAR-EDUCATION-7-11111',
        hasResources: true,
        price: null,
        hasPrice: false,
        allowsSubmissions: true, // Flag to enable submission feature
      },
    ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      sports: 'bg-blue-500',
      learning: 'bg-green-500',
      social: 'bg-purple-500',
      environmental: 'bg-emerald-500',
      'e-sport': 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-4">
        <h1 className="text-2xl mb-2">
          {t('رؤى وتوصيات', 'Insights', 'Aperçus')}
        </h1>
        <p className="text-sm opacity-90">
          {t('اكتشف الأنشطة والفعاليات المناسبة لك', 'Discover activities tailored for you', 'Découvrez des activités adaptées pour vous')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <Button
          onClick={onQuestsClick}
          variant="outline"
          className="h-16 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>{t('مهام', 'Quests', 'Quêtes')}</span>
          </div>
          <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        </Button>
        <Button
          onClick={onChatsClick}
          variant="outline"
          className="h-16 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span>{t('المحادثات', 'Chats', 'Discussions')}</span>
          </div>
          <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Registered Center Section */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">{t('دار الشباب المسجل فيه', 'Your Youth Center', 'Votre Maison de Jeunes')}</h2>
        </div>
        
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onCenterClick(registeredCenter.id)}>
          <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${registeredCenter.image})` }}>
            <div className="h-full bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <div className="text-white">
                <h3 className="text-lg">{registeredCenter.name}</h3>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{registeredCenter.wilaya}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{registeredCenter.memberCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{registeredCenter.rating}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                {t('عرض التفاصيل', 'View Details', 'Voir Détails')}
                <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs for different views */}
      <div className="px-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="overview">{t('نظرة عامة', 'Overview', 'Aperçu')}</TabsTrigger>
            <TabsTrigger value="calendar">{t('التقويم', 'Calendar', 'Calendrier')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* My Activities & Workshops */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-lg">{t('أنشطتي وورشاتي', 'My Activities & Workshops', 'Mes activités et ateliers')}</h2>
                </div>
                {myActivities.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {myActivities.length} {t('نشاط', 'activities', 'activités')}
                  </span>
                )}
              </div>
              
              {myActivities.length === 0 ? (
                <Card className="p-6 text-center mx-4">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {t('لم تسجل في أي نشاط بعد', 'You haven\'t registered for any activities yet', 'Vous ne vous êtes inscrit à aucune activité')}
                  </p>
                </Card>
              ) : (
                <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
                  <div className="flex gap-4 pb-4 w-max sm:w-full">
                    {myActivities.map((activity) => {
                    const getStatusConfig = () => {
                      switch (activity.registrationStatus) {
                        case 'approved':
                          return {
                            label: t('موافق عليه', 'Approved', 'Approuvé'),
                            icon: CheckCircle,
                            color: 'text-white bg-green-600 border-green-700 shadow-sm backdrop-blur-sm',
                            iconColor: 'text-white',
                          };
                        case 'pending':
                          return {
                            label: t('قيد الانتظار', 'Pending', 'En attente'),
                            icon: AlertCircle,
                            color: 'text-white bg-yellow-500 border-yellow-600 shadow-sm backdrop-blur-sm',
                            iconColor: 'text-white',
                          };
                        case 'attended':
                          return {
                            label: t('حاضر', 'Attended', 'Présent'),
                            icon: CheckCircle,
                            color: 'text-white bg-blue-600 border-blue-700 shadow-sm backdrop-blur-sm',
                            iconColor: 'text-white',
                          };
                        case 'rejected':
                          return {
                            label: t('مرفوض', 'Rejected', 'Rejeté'),
                            icon: XCircle,
                            color: 'text-white bg-red-600 border-red-700 shadow-sm backdrop-blur-sm',
                            iconColor: 'text-white',
                          };
                        default:
                          return {
                            label: t('مسجل', 'Registered', 'Inscrit'),
                            icon: CheckCircle,
                            color: 'text-white bg-gray-600 border-gray-700 shadow-sm backdrop-blur-sm',
                            iconColor: 'text-white',
                          };
                      }
                    };

                    const statusConfig = getStatusConfig();
                    const StatusIcon = statusConfig.icon;
                    const isUpcoming = new Date(activity.date) >= new Date();
                    const daysUntil = isUpcoming 
                      ? Math.ceil((new Date(activity.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : null;

                    // Ensure type field exists, default to 'education' if missing
                    const activityType = activity.type || 'education';
                    const finalActivityId = `${activityType}_${activity.id}`;
                    
                    return (
                      <Card 
                        key={activity.id} 
                        className="inline-block w-[300px] sm:w-[320px] flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[InsightsScreen] Clicking activity card - ID:', finalActivityId, 'Activity:', activity);
                          onActivityClick(finalActivityId);
                        }}
                      >
                        {/* Image Header */}
                        <div className="relative h-36">
                          <img 
                            src={activity.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'} 
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                          
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                              <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor}`} />
                              {statusConfig.label}
                            </Badge>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className={`${getCategoryColor(activity.category)} text-white`}>
                              {activity.category}
                            </Badge>
                          </div>

                          {/* Days Until Badge */}
                          {isUpcoming && daysUntil !== null && daysUntil >= 0 && (
                            <div className="absolute bottom-3 left-3">
                              <Badge variant="outline" className="bg-black/50 text-white border-white/30 backdrop-blur-sm">
                                <Clock className="w-3 h-3 mr-1" />
                                {daysUntil === 0 
                                  ? t('اليوم', 'Today', 'Aujourd\'hui')
                                  : daysUntil === 1
                                  ? t('غداً', 'Tomorrow', 'Demain')
                                  : `${daysUntil} ${t('يوم', 'days', 'jours')}`
                                }
                              </Badge>
                            </div>
                          )}

                          {/* Title */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-base font-semibold line-clamp-2">{activity.title}</h3>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3 space-y-2">
                          {/* Description */}
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {activity.description}
                          </p>

                          {/* Details Grid - Compact */}
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate text-xs">{activity.centerName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="text-xs">{activity.date}</span>
                              <span className="text-xs opacity-60">•</span>
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="text-xs">{activity.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="w-3 h-3 flex-shrink-0" />
                              <span className="text-xs">{activity.registered}/{activity.capacity}</span>
                              {activity.instructor && (
                                <>
                                  <span className="text-xs opacity-60">•</span>
                                  <GraduationCap className="w-3 h-3 flex-shrink-0" />
                                  <span className="text-xs truncate">{activity.instructor}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Additional Info - Compact */}
                          <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {activity.hasResources && (
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                  <BookOpen className="w-2.5 h-2.5 mr-1" />
                                  {t('موارد', 'Resources', 'Ressources')}
                                </Badge>
                              )}
                              {activity.qrCode && (
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                  {t('تذكرة', 'Ticket', 'Billet')}
                                </Badge>
                              )}
                              {activity.paymentStatus === 'completed' && activity.hasPrice && (
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-green-600">
                                  {t('مدفوع', 'Paid', 'Payé')}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Registration Date - Compact */}
                          <div className="text-[10px] text-muted-foreground pt-1 border-t border-border">
                            {t('تاريخ التسجيل', 'Registered on', 'Inscrit le')}: {activity.registrationDate}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming in Area */}
            <div className="space-y-3">
              <h2 className="text-lg">{t('قادم في منطقتك', 'Upcoming in Your Area', 'À venir dans votre région')}</h2>
                  {upcomingInArea.map((event) => {
                    const eventType = event.type || 'education';
                    const eventActivityId = `${eventType}_${event.id}`;
                    
                    return (
                      <Card 
                        key={event.id} 
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[InsightsScreen] Clicking upcoming event - ID:', eventActivityId, 'Event:', event);
                          onActivityClick(eventActivityId);
                        }}
                      >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="mb-2">{event.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{event.centerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>{event.date} • {event.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.registered}/{event.capacity}
                          </span>
                        </div>
                      </div>
                    </Card>
                    );
                  })}
            </div>

            {/* Recommended based on interests */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg">{t('موصى به لك', 'Recommended for You', 'Recommandé pour vous')}</h2>
              </div>
                  {recommendedEvents.map((event) => {
                    const eventType = event.type || 'direct_activity';
                    const eventActivityId = `${eventType}_${event.id}`;
                    
                    return (
                      <Card 
                        key={event.id} 
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[InsightsScreen] Clicking recommended event - ID:', eventActivityId, 'Event:', event);
                          onActivityClick(eventActivityId);
                        }}
                      >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3>{event.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {event.matchScore}% {t('توافق', 'match', 'correspondance')}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{event.centerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>{event.date} • {event.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.registered}/{event.capacity}
                          </span>
                        </div>
                      </div>
                    </Card>
                    );
                  })}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-3 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg">
                {t('البرامج الأسبوعية - ', 'Weekly Programs - ', 'Programmes hebdomadaires - ')}
                {registeredCenter.name}
              </h2>
            </div>
            
            {upcomingPrograms.map((program, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-primary">{program.day}</div>
                  </div>
                  <div className={`w-1 h-12 rounded-full ${getCategoryColor(program.category)}`} />
                  <div className="flex-1">
                    <h3 className="text-sm mb-1">{program.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{program.time}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {program.category}
                  </Badge>
                </div>
              </Card>
            ))}

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onCenterClick(registeredCenter.id)}
            >
              {t('عرض التقويم الكامل', 'View Full Calendar', 'Voir calendrier complet')}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
