import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { useAuth } from '../lib/authContext';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Medal, Award, MapPin, Users, Loader2 } from 'lucide-react';
import { leaderboardService, LeaderboardEntry } from '../lib/api/leaderboard';
import { toast } from 'sonner';

interface LeaderboardScreenProps {}

export function LeaderboardScreen({}: LeaderboardScreenProps) {
  const { t, language } = useApp();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<'algeria' | 'wilaya' | 'commune'>('algeria');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [scope]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const wilaya = (scope === 'wilaya' || scope === 'commune') && user?.wilaya ? user.wilaya : undefined;
      const commune = scope === 'commune' && user?.commune ? user.commune : undefined;
      const data = await leaderboardService.getLeaderboard(scope, wilaya, commune);
      setLeaderboard(data.leaderboard || []);
      
      // Find current user's rank
      if (user?.id) {
        const userEntry = data.leaderboard?.find(entry => entry.user_id === user.id);
        setCurrentUserRank(userEntry?.rank || null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error(t('فشل تحميل لوحة المتصدرين', 'Failed to load leaderboard', 'Échec du chargement du classement'));
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-500 fill-orange-500" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20';
    if (rank === 2) return 'border-gray-300 bg-gray-50 dark:bg-gray-900/20';
    if (rank === 3) return 'border-orange-400 bg-orange-50 dark:bg-orange-950/20';
    return 'border-border bg-card';
  };

  const formatUserName = (entry: LeaderboardEntry) => {
    return `${entry.prenom} ${entry.nom}`;
  };

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {t('لوحة المتصدرين', 'Leaderboard', 'Classement')}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {currentUserRank 
                ? t(`مرتبتك: #${currentUserRank}`, `Your rank: #${currentUserRank}`, `Votre rang: #${currentUserRank}`)
                : t('شاهد أفضل المتصدرين', 'See top performers', 'Voir les meilleurs')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Scope Tabs */}
      <Tabs value={scope} onValueChange={(value) => setScope(value as 'algeria' | 'wilaya' | 'commune')} className="w-full">
        <TabsList className="w-full rounded-none border-b bg-card">
          <TabsTrigger value="algeria" className="flex-1">
            {t('كل الجزائر', 'All Algeria', 'Toute l\'Algérie')}
          </TabsTrigger>
          <TabsTrigger value="wilaya" className="flex-1" disabled={!user?.wilaya}>
            {user?.wilaya || t('الولاية', 'Wilaya', 'Wilaya')}
          </TabsTrigger>
          <TabsTrigger value="commune" className="flex-1" disabled={!user?.wilaya || !user?.commune}>
            {user?.commune || t('البلدية', 'Commune', 'Commune')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={scope} className="p-4 space-y-4 mt-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t('لا توجد بيانات متاحة', 'No data available', 'Aucune donnée disponible')}
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Cards - Grid Layout (3 columns, 1 row) */}
              {leaderboard.length >= 3 && (
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    {/* 1st Place */}
                    <div className="relative bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-xl p-3 border-2 border-yellow-400 dark:border-yellow-600 shadow-lg">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-md mb-2">
                          <Trophy className="w-6 h-6 text-yellow-900" />
                        </div>
                        <p className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                          {t('الأول', '1st', '1er')}
                        </p>
                        <p className="text-xs font-bold text-yellow-900 dark:text-yellow-100 truncate w-full mb-1">
                          {formatUserName(leaderboard[0])}
                        </p>
                        <p className="text-[9px] text-yellow-600 dark:text-yellow-500 mb-2 line-clamp-1">
                          {leaderboard[0].wilaya}
                        </p>
                        <div className="pt-2 border-t border-yellow-300 dark:border-yellow-700 w-full">
                          <p className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                            {leaderboard[0].score.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-yellow-600 dark:text-yellow-400">
                            {t('نقطة', 'pts', 'pts')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2nd Place */}
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-3 border-2 border-gray-200 dark:border-gray-700 shadow-md">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-md mb-2">
                          <Medal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {t('الثاني', '2nd', '2e')}
                        </p>
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate w-full mb-1">
                          {formatUserName(leaderboard[1])}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                          {leaderboard[1].wilaya}
                        </p>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 w-full">
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {leaderboard[1].score.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400">
                            {t('نقطة', 'pts', 'pts')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="relative bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl p-3 border-2 border-orange-200 dark:border-orange-700 shadow-md">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-orange-300 dark:bg-orange-600 flex items-center justify-center shadow-md mb-2">
                          <Medal className="w-5 h-5 text-orange-900 dark:text-orange-100" />
                        </div>
                        <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400 mb-1">
                          {t('الثالث', '3rd', '3e')}
                        </p>
                        <p className="text-xs font-bold text-orange-900 dark:text-orange-100 truncate w-full mb-1">
                          {formatUserName(leaderboard[2])}
                        </p>
                        <p className="text-[9px] text-orange-500 dark:text-orange-500 mb-2 line-clamp-1">
                          {leaderboard[2].wilaya}
                        </p>
                        <div className="pt-2 border-t border-orange-200 dark:border-orange-700 w-full">
                          <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                            {leaderboard[2].score.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-orange-500 dark:text-orange-400">
                            {t('نقطة', 'pts', 'pts')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of the leaderboard (excluding top 3) */}
              {leaderboard.length > 3 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                    {t('المتصدرون الآخرون', 'Other Leaders', 'Autres leaders')}
                  </h3>
                  {leaderboard.slice(3).map((entry) => {
                    const isCurrentUser = user?.id === entry.user_id;
                    return (
                      <div
                        key={entry.user_id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isCurrentUser
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
                            <span className="text-lg font-bold">#{entry.rank}</span>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                                {formatUserName(entry)}
                              </p>
                              {isCurrentUser && (
                                <Badge variant="secondary" className="text-xs">
                                  {t('أنت', 'You', 'Vous')}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>
                                  {entry.commune ? `${entry.commune}, ${entry.wilaya}` : entry.wilaya}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                <span>
                                  {entry.attended_events_count} {t('فعالية', 'events', 'événements')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Points */}
                          <div className="text-right">
                            <p className={`text-xl font-bold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                              {entry.score.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t('نقطة', 'points', 'points')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
}

