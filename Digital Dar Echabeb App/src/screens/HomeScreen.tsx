import React from 'react';
import { useApp } from '../lib/context';
import { mockActivities } from '../lib/data';
import { Bell, Search, Map, Video, Calendar, Clock, Users, BookOpen, MessageCircle, ChevronRight, GraduationCap, Users as UsersIcon, Lightbulb } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface HomeScreenProps {
  onActivityClick: (activityId: string) => void;
  onNotificationsClick: () => void;
  onMapClick: () => void;
  onCenterClick: (centerId: string) => void;
}

export function HomeScreen({ onActivityClick, onNotificationsClick, onMapClick, onCenterClick }: HomeScreenProps) {
  const { t, language } = useApp();

  // Live & Upcoming Events Data
  const eventsData = [
    {
      id: 'e1',
      title: 'ندوة القيادة الشبابية',
      description: 'لقاء تفاعلي مع قادة محليين ومتحدثين ملهمين',
      category: 'social',
      centerName: 'دار الشباب المركزي',
      centerId: '1',
      organizerContact: '+213 555 123 456',
      date: '2025-11-15',
      time: '18:00',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
    },
    {
      id: 'e2',
      title: 'ورشة التصميم الجرافيكي',
      description: 'تعلم أساسيات التصميم باستخدام Adobe Photoshop',
      category: 'learning',
      centerName: 'دار الشباب وهران',
      centerId: '2',
      organizerContact: '+213 555 234 567',
      date: '2025-11-17',
      time: '15:00',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
    },
    {
      id: 'e3',
      title: 'جلسة تطوير الذات',
      description: 'استراتيجيات النجاح والتطوير الشخصي',
      category: 'social',
      centerName: 'دار الشباب قسنطينة',
      centerId: '3',
      organizerContact: '+213 555 345 678',
      date: '2025-11-12',
      time: '19:00',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
    },
    {
      id: 'e4',
      title: 'البرمجة بلغة Python',
      description: 'دورة متقدمة في البرمجة للمبتدئين',
      category: 'learning',
      centerName: 'دار الشباب المركزي',
      centerId: '1',
      organizerContact: '+213 555 456 789',
      date: '2025-11-20',
      time: '16:00',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    },
  ];

  // Learning Programs Data
  const learningData = [
    {
      id: 'l1',
      title: 'برنامج القيادة الشبابية',
      description: 'برنامج متقدم لتطوير مهارات القيادة والإدارة',
      duration: '6 أسابيع',
      level: 'متقدم',
      centerName: 'دار الشباب المركزي',
      centerId: '1',
      organizerContact: '+213 555 111 222',
      image: 'https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=600&h=400&fit=crop',
    },
    {
      id: 'l2',
      title: 'مهارات التواصل الفعال',
      description: 'تعلم فن التواصل والتأثير في الآخرين',
      duration: '4 أسابيع',
      level: 'مبتدئ',
      centerName: 'دار الشباب وهران',
      centerId: '2',
      organizerContact: '+213 555 222 333',
      image: 'https://images.unsplash.com/photo-1545886082-e66c6b9e011a?w=600&h=400&fit=crop',
    },
    {
      id: 'l3',
      title: 'إدارة المشاريع الحديثة',
      description: 'أسس إدارة المشاريع وأفضل الممارسات العالمية',
      duration: '8 أسابيع',
      level: 'متوسط',
      centerName: 'دار الشباب قسنطينة',
      centerId: '3',
      organizerContact: '+213 555 333 444',
      image: 'https://images.unsplash.com/photo-1758599669406-d5179ccefcb9?w=600&h=400&fit=crop',
    },
    {
      id: 'l4',
      title: 'التسويق الرقمي للمبتدئين',
      description: 'استراتيجيات التسويق الرقمي ووسائل التواصل الاجتماعي',
      duration: '5 أسابيع',
      level: 'مبتدئ',
      centerName: 'دار الشباب المركزي',
      centerId: '1',
      organizerContact: '+213 555 444 555',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    },
  ];

  // Community Projects Data
  const communityData = [
    {
      id: 'c1',
      title: 'مختبر الروبوتات للشباب',
      description: 'تعلم البرمجة وبناء روبوتات بسيطة في مختبر مجهز',
      votes: 142,
      targetAudience: 'الشباب 15-25 سنة',
      centerName: 'دار الشباب المركزي',
      centerId: '1',
      organizerContact: '+213 555 666 777',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
    },
    {
      id: 'c2',
      title: 'مركز الفنون والحرف اليدوية',
      description: 'تعليم الفنون التقليدية الجزائرية والحرف اليدوية',
      votes: 98,
      targetAudience: 'جميع الأعمار',
      centerName: 'دار الشباب وهران',
      centerId: '2',
      organizerContact: '+213 555 777 888',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
    },
    {
      id: 'c3',
      title: 'حديقة حضرية مجتمعية',
      description: 'مساحة خضراء لزراعة الخضروات وتعزيز الوعي البيئي',
      votes: 87,
      targetAudience: 'الشباب والعائلات',
      centerName: 'دار الشباب قسنطينة',
      centerId: '3',
      organizerContact: '+213 555 888 999',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop',
    },
    {
      id: 'c4',
      title: 'أكاديمية الرياضات الإلكترونية',
      description: 'تدريب احترافي للرياضات الإلكترونية مع معدات حديثة',
      votes: 156,
      targetAudience: 'الشباب 14-30 سنة',
      centerName: 'دار الشباب المركزي',
      centerId: '1',
      organizerContact: '+213 555 999 000',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    },
  ];

  const handleContactOrganizer = (contact: string) => {
    window.open(`tel:${contact}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{t('مرحباً، أحمد', 'Hello, Ahmed')}</h2>
              <p className="text-sm text-muted-foreground truncate">
                {t('اكتشف الأنشطة القادمة', 'Discover upcoming activities')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onMapClick}
                className="relative p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                title={t('الخريطة', 'Map')}
              >
                <Map className="w-5 h-5" />
              </button>
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('ابحث عن نشاط...', 'Search for activity...')}
              className="pr-10 w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 py-6 overflow-x-hidden">
        {/* Section 1: Live & Upcoming Events */}
        <div>
          <div className="flex items-center justify-between px-4 mb-3 gap-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold flex-1 min-w-0">
              <Video className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="truncate">{t('الأنشطة المباشرة والقادمة', 'Live & Upcoming Events')}</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-shrink-0"
              onClick={() => {
                // Navigate to full events page - could be expanded later
                console.log('View all events');
              }}
            >
              {t('المزيد', 'More')}
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 pb-4 w-max sm:w-full">
              {eventsData.map((event) => (
                <Card 
                  key={event.id} 
                  className="inline-block w-[280px] sm:w-[320px] flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onActivityClick(event.id)}
                >
                  <div className="relative h-48">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Status Badge */}
                    {event.status === 'live' && (
                      <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        {t('مباشر', 'LIVE')}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="mb-1.5">{event.title}</h3>
                      <p className="text-sm opacity-90 mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs opacity-80">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCenterClick(event.centerId);
                          }}
                          className="text-xs opacity-80 hover:opacity-100 underline"
                        >
                          {event.centerName}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactOrganizer(event.organizerContact);
                          }}
                          className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {t('اتصل', 'Contact')}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Learning Programs */}
        <div>
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <GraduationCap className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>{t('التعليم', 'Learning')}</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-shrink-0"
              onClick={() => {
                // Navigate to full learning page - could be expanded later
                console.log('View all learning programs');
              }}
            >
              {t('المزيد', 'More')}
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 pb-4 w-max sm:w-full">
              {learningData.map((program) => (
                <Card 
                  key={program.id} 
                  className="inline-block w-[280px] sm:w-[320px] flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onActivityClick(program.id)}
                >
                  <div className="relative h-48">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">
                        {program.level}
                      </Badge>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="mb-1.5">{program.title}</h3>
                      <p className="text-sm opacity-90 mb-2">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs opacity-80 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCenterClick(program.centerId);
                          }}
                          className="text-xs opacity-80 hover:opacity-100 underline"
                        >
                          {program.centerName}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactOrganizer(program.organizerContact);
                          }}
                          className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {t('اتصل', 'Contact')}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Community Projects */}
        <div>
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <UsersIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span>{t('المجتمع', 'Community')}</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-shrink-0"
              onClick={() => {
                // Navigate to full community page - could be expanded later
                console.log('View all community projects');
              }}
            >
              {t('المزيد', 'More')}
              <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 pb-4 w-max sm:w-full">
              {communityData.map((project) => (
                <Card 
                  key={project.id} 
                  className="inline-block w-[280px] sm:w-[320px] flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onActivityClick(project.id)}
                >
                  <div className="relative h-48">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Votes Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-purple-500 text-white flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        {project.votes}
                      </Badge>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="mb-1.5">{project.title}</h3>
                      <p className="text-sm opacity-90 mb-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs opacity-80 mb-2">
                        <Users className="w-3 h-3" />
                        <span>{project.targetAudience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCenterClick(project.centerId);
                          }}
                          className="text-xs opacity-80 hover:opacity-100 underline"
                        >
                          {project.centerName}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactOrganizer(project.organizerContact);
                          }}
                          className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {t('اتصل', 'Contact')}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
