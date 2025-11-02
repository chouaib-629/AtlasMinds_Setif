import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockQuests, mockLeaderboard, mockBadges } from '../lib/data';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Award, Star, Calendar, Users, TrendingUp, Gift } from 'lucide-react';
import { BackButton } from '../components/BackButton';

interface QuestScreenProps {
  onBack?: () => void;
}

export function QuestScreen({ onBack }: QuestScreenProps = {}) {
  const { t } = useApp();
  const [leaderboardFilter, setLeaderboardFilter] = useState('all');

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-40 bg-background border-b border-border p-4">
        <div className="flex items-center gap-3">
          {onBack && <BackButton onClick={onBack} variant="icon" />}
          <h2>{t('المهام والإنجازات', 'Quests & Achievements')}</h2>
        </div>
      </div>

      <Tabs defaultValue="quests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="quests">{t('المهام', 'Quests')}</TabsTrigger>
          <TabsTrigger value="leaderboard">{t('المتصدرين', 'Leaderboard')}</TabsTrigger>
          <TabsTrigger value="badges">{t('الشارات', 'Badges')}</TabsTrigger>
        </TabsList>

        <TabsContent value="quests" className="p-4 space-y-6">
          {/* Weekly Reset Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <div>
                <p className="opacity-90">{t('إعادة تعيين أسبوعية', 'Weekly Reset')}</p>
                <p>{t('الإثنين القادم في تمام الساعة 00:00', 'Next Monday at 00:00')}</p>
              </div>
            </div>
          </div>

          {/* Buddy Pass Card */}
          <div className="bg-gradient-to-br from-pink-500 to-orange-500 text-white p-6 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6" />
              <h3>{t('تصريح الصديق', 'Buddy Pass')}</h3>
            </div>
            <p className="opacity-90">
              {t('ادع صديقاً واحصل على نقاط إضافية عند تسجيله', 
                 'Invite a friend and get bonus points when they sign up')}
            </p>
            <button className="bg-white text-pink-600 px-4 py-2 rounded-lg">
              {t('مشاركة التصريح', 'Share Pass')}
            </button>
          </div>

          {/* Daily Quests */}
          <div className="space-y-3">
            <h3>{t('مهام يومية', 'Daily Quests')}</h3>
            {mockQuests
              .filter(q => q.type === 'daily')
              .map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            {mockQuests.filter(q => q.type === 'daily').length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {t('لا توجد مهام يومية متاحة', 'No daily quests available')}
              </p>
            )}
          </div>

          {/* Weekly Quests */}
          <div className="space-y-3">
            <h3>{t('مهام أسبوعية', 'Weekly Quests')}</h3>
            {mockQuests
              .filter(q => q.type === 'weekly')
              .map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
          </div>

          {/* Seasonal Quests */}
          <div className="space-y-3">
            <h3>{t('مهام موسمية', 'Seasonal Quests')}</h3>
            {mockQuests
              .filter(q => q.type === 'seasonal')
              .map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="p-4 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: t('الجميع', 'All') },
              { id: 'wilaya', label: t('ولايتي', 'My Wilaya') },
              { id: 'age', label: t('فئتي العمرية', 'My Age') },
              { id: 'field', label: t('مجالي', 'My Field') },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setLeaderboardFilter(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  leaderboardFilter === filter.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Division Badges */}
          <div className="grid grid-cols-5 gap-2 py-4">
            {['Rookie', 'Bronze', 'Silver', 'Gold', 'Platinum'].map((div, i) => (
              <div key={div} className="text-center space-y-1">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  i === 0 ? 'bg-slate-200' :
                  i === 1 ? 'bg-orange-200' :
                  i === 2 ? 'bg-slate-300' :
                  i === 3 ? 'bg-yellow-200' :
                  'bg-purple-200'
                }`}>
                  <Trophy className="w-6 h-6" />
                </div>
                <p className="text-xs">{div}</p>
              </div>
            ))}
          </div>

          {/* Leaderboard List */}
          <div className="space-y-3">
            {mockLeaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`p-4 rounded-xl border ${
                  entry.rank <= 3
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    entry.rank === 2 ? 'bg-slate-300 text-slate-900' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {entry.rank <= 3 ? (
                      <Trophy className="w-5 h-5" />
                    ) : (
                      <span>{entry.rank}</span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p>{entry.userName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{entry.wilaya}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-left">
                    <p className="text-primary">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t('نقطة', 'points')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="p-4 space-y-4">
          {/* Badge Fragments Progress */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl space-y-3">
            <h3>{t('قطع الشارات', 'Badge Fragments')}</h3>
            <p className="opacity-90">
              {t('اجمع القطع لفتح شارات جديدة', 'Collect fragments to unlock new badges')}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center ${
                    i <= 5 ? 'bg-white/30' : 'bg-white/10'
                  }`}
                >
                  {i <= 5 && <Star className="w-5 h-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Earned Badges */}
          <div className="space-y-3">
            <h3>{t('الشارات المكتسبة', 'Earned Badges')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {mockBadges
                .filter(b => b.earned)
                .map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
          </div>

          {/* Locked Badges */}
          <div className="space-y-3">
            <h3>{t('شارات مقفلة', 'Locked Badges')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {mockBadges
                .filter(b => !b.earned)
                .map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuestCard({ quest }: { quest: any }) {
  const { t } = useApp();
  const progressPercent = (quest.progress / quest.total) * 100;

  return (
    <div className={`p-4 rounded-xl border ${
      quest.completed
        ? 'bg-accent/10 border-accent'
        : 'bg-card border-border'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="mb-1">{quest.title}</h4>
          <p className="text-muted-foreground">{quest.description}</p>
        </div>
        <Badge className="bg-primary text-primary-foreground">
          +{quest.reward}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {quest.progress}/{quest.total}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
    </div>
  );
}

function BadgeCard({ badge }: { badge: any }) {
  const { t } = useApp();
  
  const tierColors = {
    Bronze: 'from-orange-400 to-orange-600',
    Silver: 'from-slate-300 to-slate-500',
    Gold: 'from-yellow-400 to-yellow-600',
    Platinum: 'from-purple-400 to-purple-600',
  };

  return (
    <div className={`p-4 rounded-xl border ${
      badge.earned
        ? 'bg-card border-border'
        : 'bg-muted/50 border-muted opacity-60'
    }`}>
      <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${tierColors[badge.tier]} flex items-center justify-center text-white`}>
        <Award className="w-8 h-8" />
      </div>
      
      <h4 className="text-center mb-1">{badge.name}</h4>
      <p className="text-sm text-muted-foreground text-center mb-2">
        {badge.description}
      </p>

      {!badge.earned && badge.fragments !== undefined && badge.totalFragments !== undefined && (
        <div className="space-y-1">
          <Progress 
            value={(badge.fragments / badge.totalFragments) * 100} 
            className="h-1"
          />
          <p className="text-xs text-center text-muted-foreground">
            {badge.fragments}/{badge.totalFragments} {t('قطع', 'fragments')}
          </p>
        </div>
      )}

      {badge.earned && badge.earnedAt && (
        <p className="text-xs text-center text-muted-foreground">
          {t('حصل عليها في', 'Earned on')} {badge.earnedAt}
        </p>
      )}
    </div>
  );
}
