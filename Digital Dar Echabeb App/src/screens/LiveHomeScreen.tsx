import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { ArrowRight, Radio, Calendar, Clock, Users, Filter, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import type { LiveSession } from '../lib/types';

interface LiveHomeScreenProps {
  onBack: () => void;
  onSessionClick: (sessionId: string) => void;
}

const MOCK_LIVE_SESSIONS: LiveSession[] = [
  {
    id: '1',
    title: 'ورشة البرمجة المباشرة',
    description: 'تعلم أساسيات React و TypeScript',
    centerId: '1',
    centerName: 'دار الشباب المركزي',
    category: 'workshop',
    hostName: 'أحمد محمود',
    scheduledTime: '2025-11-02T14:00:00',
    status: 'live',
    viewerCount: 142,
    thumbnail: '',
  },
  {
    id: '2',
    title: 'بطولة الألعاب الإلكترونية',
    description: 'مباراة FIFA النهائية',
    centerId: '2',
    centerName: 'دار الشباب الرياضي',
    category: 'e-sport',
    hostName: 'كريم العربي',
    scheduledTime: '2025-11-02T16:00:00',
    status: 'live',
    viewerCount: 328,
    thumbnail: '',
  },
  {
    id: '3',
    title: 'جلسة الواقع الافتراضي',
    description: 'استكشاف تقنية VR',
    centerId: '1',
    centerName: 'دار الشباب المركزي',
    category: 'vr',
    hostName: 'فاطمة بن علي',
    scheduledTime: '2025-11-02T18:00:00',
    status: 'upcoming',
    viewerCount: 0,
    thumbnail: '',
  },
  {
    id: '4',
    title: 'حفل موسيقي مباشر',
    description: 'عروض فنية من المواهب المحلية',
    centerId: '3',
    centerName: 'دار الشباب الثقافي',
    category: 'concert',
    hostName: 'محمد الأمين',
    scheduledTime: '2025-11-02T20:00:00',
    status: 'upcoming',
    viewerCount: 0,
    thumbnail: '',
  },
  {
    id: '5',
    title: 'ورشة التصميم الجرافيكي',
    description: 'أساسيات Figma للمبتدئين',
    centerId: '1',
    centerName: 'دار الشباب المركزي',
    category: 'workshop',
    hostName: 'سارة قاسم',
    scheduledTime: '2025-11-01T15:00:00',
    status: 'ended',
    viewerCount: 0,
    duration: 120,
  },
];

export function LiveHomeScreen({ onBack, onSessionClick }: LiveHomeScreenProps) {
  const { t } = useApp();
  const [selectedTab, setSelectedTab] = useState('live');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filterSessions = (status: 'live' | 'upcoming' | 'ended') => {
    return MOCK_LIVE_SESSIONS.filter((session) => {
      const statusMatch = session.status === status;
      const categoryMatch = categoryFilter === 'all' || session.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  };

  const liveSessions = filterSessions('live');
  const upcomingSessions = filterSessions('upcoming');
  const pastSessions = filterSessions('ended');

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { ar: string; en: string; fr: string }> = {
      workshop: { ar: 'ورشة', en: 'Workshop', fr: 'Atelier' },
      'e-sport': { ar: 'ألعاب إلكترونية', en: 'E-sport', fr: 'E-sport' },
      vr: { ar: 'واقع افتراضي', en: 'VR', fr: 'VR' },
      concert: { ar: 'حفل', en: 'Concert', fr: 'Concert' },
      discussion: { ar: 'نقاش', en: 'Discussion', fr: 'Discussion' },
    };
    return t(labels[category]?.ar || category, labels[category]?.en, labels[category]?.fr);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-11 w-11">
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-destructive" />
              <h1>{t('البث المباشر', 'Live', 'En Direct')}</h1>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <Filter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                {t('الكل', 'All', 'Tous')}
                {categoryFilter === 'all' && <span className="mr-auto text-primary">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('workshop')}>
                {getCategoryLabel('workshop')}
                {categoryFilter === 'workshop' && <span className="mr-auto text-primary">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('e-sport')}>
                {getCategoryLabel('e-sport')}
                {categoryFilter === 'e-sport' && <span className="mr-auto text-primary">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('vr')}>
                {getCategoryLabel('vr')}
                {categoryFilter === 'vr' && <span className="mr-auto text-primary">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none">
            <TabsTrigger value="live">
              {t('مباشر الآن', 'Live Now', 'En Direct')}
              {liveSessions.length > 0 && (
                <Badge variant="destructive" className="mr-2 h-5 min-w-[20px] px-1">
                  {liveSessions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              {t('قادم', 'Upcoming', 'À venir')}
            </TabsTrigger>
            <TabsTrigger value="past">{t('منتهي', 'Past', 'Passé')}</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4 p-4">
            {liveSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Radio className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {t('لا توجد جلسات مباشرة حالياً', 'No live sessions right now', 'Aucune session en direct')}
                </p>
              </div>
            ) : (
              liveSessions.map((session) => (
                <LiveSessionCard
                  key={session.id}
                  session={session}
                  onClick={() => onSessionClick(session.id)}
                  getCategoryLabel={getCategoryLabel}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4 p-4">
            {upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {t('لا توجد جلسات قادمة', 'No upcoming sessions', 'Aucune session à venir')}
                </p>
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <LiveSessionCard
                  key={session.id}
                  session={session}
                  onClick={() => onSessionClick(session.id)}
                  getCategoryLabel={getCategoryLabel}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 p-4">
            {pastSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {t('لا توجد جلسات منتهية', 'No past sessions', 'Aucune session passée')}
                </p>
              </div>
            ) : (
              pastSessions.map((session) => (
                <LiveSessionCard
                  key={session.id}
                  session={session}
                  onClick={() => onSessionClick(session.id)}
                  getCategoryLabel={getCategoryLabel}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

interface LiveSessionCardProps {
  session: LiveSession;
  onClick: () => void;
  getCategoryLabel: (category: string) => string;
}

function LiveSessionCard({ session, onClick, getCategoryLabel }: LiveSessionCardProps) {
  const { t } = useApp();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video bg-muted">
        {session.status === 'live' && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded bg-destructive px-2 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="text-xs text-white">{t('مباشر', 'LIVE', 'EN DIRECT')}</span>
          </div>
        )}
        <div className="flex h-full items-center justify-center">
          <Play className="h-12 w-12 text-muted-foreground opacity-50" />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2">{session.title}</h3>
          {session.status === 'live' && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{session.viewerCount}</span>
            </div>
          )}
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{session.description}</p>
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{getCategoryLabel(session.category)}</Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(session.scheduledTime)}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{session.centerName}</span>
          <span>{session.hostName}</span>
        </div>
        {session.status === 'upcoming' && (
          <Button className="mt-3 w-full" variant="outline">
            {t('تذكيري', 'Remind Me', 'Me rappeler')}
          </Button>
        )}
        {session.status === 'live' && (
          <Button className="mt-3 w-full">
            {t('انضم الآن', 'Join Now', 'Rejoindre')}
          </Button>
        )}
      </div>
    </div>
  );
}
