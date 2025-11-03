import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { mockActivities } from '../lib/data';
import { homeService, HomeEvent, LearningProgram, CommunityProject } from '../lib/api';
import { livestreamService, Livestream } from '../lib/api/livestreams';
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
  onLivestreamClick?: (livestreamId: string) => void;
}

export function HomeScreen({ onActivityClick, onNotificationsClick, onMapClick, onCenterClick, onLivestreamClick }: HomeScreenProps) {
  const { t, language } = useApp();
  const [eventsData, setEventsData] = useState<HomeEvent[]>([]);
  const [learningData, setLearningData] = useState<LearningProgram[]>([]);
  const [communityData, setCommunityData] = useState<CommunityProject[]>([]);
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch home data and livestreams from API
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [homeData, livestreamsData] = await Promise.all([
          homeService.getHomeData().catch(() => ({ events: [], learning: [], community: [] })),
          livestreamService.getAllLivestreams().catch(() => []),
        ]);
        setEventsData(homeData.events || []);
        setLearningData(homeData.learning || []);
        setCommunityData(homeData.community || []);
        setLivestreams(livestreamsData || []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load home data');
        // Fallback to empty arrays on error
        setEventsData([]);
        setLearningData([]);
        setCommunityData([]);
        setLivestreams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
    
    // Refresh livestreams every 30 seconds
    const interval = setInterval(async () => {
      try {
        const livestreamsData = await livestreamService.getAllLivestreams();
        setLivestreams(livestreamsData || []);
      } catch (err) {
        console.error('Failed to refresh livestreams:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Use API data, with empty arrays as fallback
  const displayEvents = eventsData.length > 0 ? eventsData : [];
  const displayLearning = learningData.length > 0 ? learningData : [];
  const displayCommunity = communityData.length > 0 ? communityData : [];

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
        {/* Loading State */}
        {isLoading && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <p>{t('جاري التحميل...', 'Loading...')}</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="px-4 py-8 text-center">
            <p className="text-destructive text-sm mb-2">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              {t('إعادة المحاولة', 'Retry')}
            </Button>
          </div>
        )}

        {/* Section 1: Live & Upcoming Events */}
        {!isLoading && (
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
          
          {(displayEvents.length > 0 || livestreams.length > 0) ? (
          <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 pb-4 w-max sm:w-full">
              {/* Show livestreams first */}
              {livestreams.map((livestream) => {
                // Check if this livestream corresponds to "ندوة القيادة الشبابية" (Youth Leadership Seminar)
                const isYouthLeadership = livestream.title?.includes('القيادة الشبابية') || 
                                         livestream.title?.includes('Youth Leadership') ||
                                         livestream.event_title?.includes('القيادة الشبابية') ||
                                         livestream.event_title?.includes('Youth Leadership');
                
                return (
                  <Card 
                    key={`livestream-${livestream.id}`} 
                    className="inline-block w-[280px] sm:w-[320px] flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      if (onLivestreamClick) {
                        onLivestreamClick(livestream.id.toString());
                      } else {
                        // Fallback: navigate to virtual hall with event ID if available
                        const activityId = livestream.event_id?.toString() || livestream.id.toString();
                        onActivityClick(activityId);
                      }
                    }}
                  >
                    <div className="relative h-48">
                      <div className="w-full h-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center">
                        <Video className="w-16 h-16 text-white/80" />
                      </div>
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Live Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        {t('مباشر', 'LIVE')}
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="mb-1.5">{livestream.title || t('ندوة القيادة الشبابية', 'Youth Leadership Seminar')}</h3>
                        {livestream.description && (
                          <p className="text-sm opacity-90 mb-2 line-clamp-2">
                            {livestream.description}
                          </p>
                        )}
                        {livestream.event_title && (
                          <p className="text-xs opacity-75 mb-2">
                            {livestream.event_title}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onLivestreamClick) {
                                onLivestreamClick(livestream.id.toString());
                              }
                            }}
                            className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                          >
                            <Video className="w-3 h-3" />
                            {t('شاهد الآن', 'Watch Now')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {/* Then show regular events */}
              {displayEvents.map((event) => (
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
          ) : (
            <div className="px-4 py-4 text-center text-muted-foreground text-sm">
              {t('لا توجد أنشطة متاحة حالياً', 'No events available at the moment')}
            </div>
          )}
        </div>
        )}

        {/* Section 2: Learning Programs */}
        {!isLoading && (
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
          
          {displayLearning.length > 0 ? (
          <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 pb-4 w-max sm:w-full">
              {displayLearning.map((program) => (
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
          ) : (
            <div className="px-4 py-4 text-center text-muted-foreground text-sm">
              {t('لا توجد برامج تعليمية متاحة حالياً', 'No learning programs available at the moment')}
            </div>
          )}
        </div>
        )}

        {/* Section 3: Community Projects */}
        {!isLoading && (
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
          
          {displayCommunity.length > 0 ? (
          <div className="w-full overflow-x-auto scroll-smooth px-4 -mx-4 sm:mx-0">
            <div className="flex gap-4 pb-4 w-max sm:w-full">
              {displayCommunity.map((project) => (
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
          ) : (
            <div className="px-4 py-4 text-center text-muted-foreground text-sm">
              {t('لا توجد مشاريع مجتمعية متاحة حالياً', 'No community projects available at the moment')}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
