import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockClubs } from '../lib/data';
import { mockCenters } from '../lib/data';
import { Club } from '../lib/types';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { ArrowLeft, ArrowRight, Users, Lock, MessageCircle, Send, Share2, CheckCircle, MapPin, Shield, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/authContext';

interface ClubDetailScreenProps {
  clubId: string;
  onBack: () => void;
  onCenterClick?: (centerId: string) => void;
}

interface DiscussionPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
  likes: number;
  replies: DiscussionPost[];
}

const MOCK_DISCUSSION_POSTS: DiscussionPost[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمد',
    text: 'مرحباً بالجميع! سعيد جداً بالانضمام لهذا النادي.',
    timestamp: '2025-11-02T10:00:00',
    likes: 12,
    replies: [],
  },
  {
    id: '2',
    userId: '2',
    userName: 'فاطمة علي',
    text: 'نرحب بك! متى سيكون الاجتماع القادم؟',
    timestamp: '2025-11-02T10:15:00',
    likes: 8,
    replies: [
      {
        id: '2-1',
        userId: '1',
        userName: 'أحمد محمد',
        text: 'الأسبوع القادم يوم الأربعاء الساعة 6 مساءً',
        timestamp: '2025-11-02T10:20:00',
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: '3',
    userId: '3',
    userName: 'محمد حسن',
    text: 'هل يمكن مشاركة بعض الموارد المفيدة؟',
    timestamp: '2025-11-02T11:00:00',
    likes: 15,
    replies: [],
  },
];

export function ClubDetailScreen({ clubId, onBack, onCenterClick }: ClubDetailScreenProps) {
  const { t, language } = useApp();
  const { isAuthenticated } = useAuth();
  const [club, setClub] = useState<Club | null>(() => mockClubs.find(c => c.id === clubId) || null);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>(MOCK_DISCUSSION_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  const center = club?.centerId ? mockCenters.find(c => c.id === club.centerId) : null;

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'support-addiction': t('دعم الإدمان', 'Addiction Support', 'Soutien aux dépendances'),
      'support-disability': t('دعم الإعاقة', 'Disability Support', 'Soutien au handicap'),
      'support-mental-health': t('الصحة النفسية', 'Mental Health', 'Santé mentale'),
      'support-vocational': t('التأهيل المهني', 'Vocational', 'Professionnel'),
      'support-violence-survivors': t('الناجون من العنف', 'Violence Survivors', 'Survivants de violence'),
      'culture-books': t('الثقافة والقراءة', 'Culture & Books', 'Culture & Livres'),
      'technology-robotics': t('التكنولوجيا', 'Technology', 'Technologie'),
      'politics-youth': t('السياسة', 'Politics', 'Politique'),
      'arts-photography': t('الفنون', 'Arts', 'Arts'),
      'entrepreneurship': t('ريادة الأعمال', 'Entrepreneurship', 'Entrepreneuriat'),
      'environment-sustainability': t('البيئة', 'Environment', 'Environnement'),
    };
    return labels[category] || category;
  };

  const isSupportClub = club?.category?.startsWith('support') || false;

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error(t('يرجى تسجيل الدخول أولاً', 'Please login first'));
      return;
    }

    if (isMember) {
      toast.info(t('أنت عضو بالفعل', 'You are already a member'));
      return;
    }

    try {
      setIsJoining(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsMember(true);
      toast.success(t('تم الانضمام بنجاح!', 'Successfully joined!'));
    } catch (err) {
      toast.error(t('فشل الانضمام', 'Failed to join'));
    } finally {
      setIsJoining(false);
    }
  };

  const handleSendPost = () => {
    if (!newPostText.trim()) return;

    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      userId: 'me',
      userName: t('أنت', 'You', 'Vous'),
      text: newPostText,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setDiscussionPosts([newPost, ...discussionPosts]);
    setNewPostText('');
    toast.success(t('تم إرسال المنشور', 'Post sent'));
  };

  const handleSendReply = (postId: string) => {
    if (!replyText.trim()) return;

    const newReply: DiscussionPost = {
      id: `reply-${Date.now()}`,
      userId: 'me',
      userName: t('أنت', 'You', 'Vous'),
      text: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setDiscussionPosts(discussionPosts.map(post => {
      if (post.id === postId) {
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    }));

    setReplyText('');
    setReplyingTo(null);
    toast.success(t('تم إرسال الرد', 'Reply sent'));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-DZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t('النادي غير موجود', 'Club not found')}</p>
          <Button onClick={onBack}>{t('العودة', 'Back')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header with Cover Image */}
      <div className="relative h-64">
        <img 
          src={club.coverImage || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop'} 
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm"
        >
          <BackIcon className="w-5 h-5" />
        </button>

        {/* Share Button */}
        <button
          onClick={() => toast.info(t('تم نسخ الرابط', 'Link copied'))}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${isSupportClub ? 'bg-orange-500' : 'bg-blue-500'}`}>
                  {getCategoryLabel(club.category)}
                </Badge>
                {club.visibility === 'private' && (
                  <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                    <Lock className="w-3 h-3 mr-1" />
                    {t('خاص', 'Private')}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2">{club.name}</h1>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{club.memberCount} {t('عضو', 'members')}</span>
                </div>
                {center && (
                  <button
                    onClick={() => onCenterClick?.(club.centerId!)}
                    className="flex items-center gap-1 hover:underline"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{center.name}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <div className="p-4 border-b border-border bg-card">
        {isMember ? (
          <Button className="w-full" disabled>
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('عضو', 'Member')}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? t('جاري الانضمام...', 'Joining...') : t('انضم للنادي', 'Join Club')}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="about" className="flex-1">
            {t('عن النادي', 'About')}
          </TabsTrigger>
          <TabsTrigger value="discussion" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('النقاش', 'Discussion')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="px-4 py-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{t('الوصف', 'Description')}</h2>
            <p className="text-muted-foreground leading-relaxed">{club.description}</p>
          </div>

          {/* Rules */}
          {club.rules && club.rules.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('قواعد النادي', 'Club Rules')}
              </h2>
              <ul className="space-y-2">
                {club.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Center Info */}
          {center && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">{t('دار الشباب', 'Youth Center')}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{center.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{center.capacity} {t('سعة', 'capacity')}</span>
                </div>
                {onCenterClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCenterClick(club.centerId!)}
                    className="mt-2"
                  >
                    {t('عرض التفاصيل', 'View Details')}
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Members Count */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">{t('الأعضاء', 'Members')}</h3>
                <p className="text-2xl font-bold text-primary">{club.memberCount}</p>
              </div>
              <Users className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="discussion" className="flex flex-col h-[calc(100vh-500px)] min-h-[400px]">
          <ScrollArea className="flex-1 px-4">
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
                            {formatTime(post.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mb-3 whitespace-pre-wrap">{post.text}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <MessageCircle className="w-3 h-3" />
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
                              onClick={() => handleSendReply(post.id)}
                              disabled={!replyText.trim()}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        )}

                        {/* Replies */}
                        {post.replies.length > 0 && (
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-border">
                            {post.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-xs">{reply.userName}</h5>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(reply.timestamp)}
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
          {isMember && (
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={t('اكتب منشوراً جديداً...', 'Write a new post...')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPost();
                    }
                  }}
                />
                <Button
                  onClick={handleSendPost}
                  disabled={!newPostText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {!isMember && (
            <div className="p-4 border-t border-border bg-muted/50 text-center text-sm text-muted-foreground">
              {t('انضم للنادي للمشاركة في النقاش', 'Join the club to participate in discussions')}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

