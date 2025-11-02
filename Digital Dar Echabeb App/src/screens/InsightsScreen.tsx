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
  TrendingUp
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
            {/* Upcoming in Area */}
            <div className="space-y-3">
              <h2 className="text-lg">{t('قادم في منطقتك', 'Upcoming in Your Area', 'À venir dans votre région')}</h2>
              {upcomingInArea.map((event) => (
                <Card key={event.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onActivityClick(event.id)}>
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
              ))}
            </div>

            {/* Recommended based on interests */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg">{t('موصى به لك', 'Recommended for You', 'Recommandé pour vous')}</h2>
              </div>
              {recommendedEvents.map((event) => (
                <Card key={event.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onActivityClick(event.id)}>
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
              ))}
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
