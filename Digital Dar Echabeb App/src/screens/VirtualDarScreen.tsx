import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockProjectSuggestions, mockCenters } from '../lib/data';
import { ProjectSuggestion } from '../lib/types';
import { 
  Video, 
  BookOpen, 
  Users, 
  Calendar,
  Star,
  Unlock,
  Download,
  Play,
  FileText,
  GraduationCap,
  TrendingUp,
  Clock,
  Eye,
  ArrowRight,
  ThumbsUp,
  MapPin,
  Navigation,
  Map,
  Plus,
  Lightbulb,
  MessageCircle,
  Share2,
  ChevronRight,
  Award,
  Code,
  Palette,
  Leaf,
  Gamepad2,
  Briefcase,
  Filter,
  Search
} from 'lucide-react';

interface VirtualDarScreenProps {
  onActivityClick: (activityId: string) => void;
  onJoinSession: (sessionId: string) => void;
  onCenterClick: (centerId: string) => void;
}

export function VirtualDarScreen({ onActivityClick, onJoinSession, onCenterClick }: VirtualDarScreenProps) {
  const { t, language } = useApp();
  const [selectedView, setSelectedView] = useState<'home' | 'suggestions' | 'library'>('home');
  const [projectSuggestions, setProjectSuggestions] = useState<ProjectSuggestion[]>(mockProjectSuggestions);
  const [showNewSuggestionDialog, setShowNewSuggestionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentUserId] = useState('1'); // Mock current user

  // Form state for new suggestion
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    description: '',
    category: 'learning',
    targetAudience: '',
    estimatedCost: '',
    duration: '',
  });

  const virtualActivities = [
    {
      id: 'v1',
      title: 'ندوة القيادة الشبابية',
      description: 'لقاء تفاعلي مع قادة محليين ومتحدثين ملهمين',
      category: 'social',
      instructor: 'د. أحمد العربي',
      date: '2025-11-15',
      time: '18:00',
      duration: 90,
      capacity: 200,
      registered: 145,
      status: 'upcoming',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    },
    {
      id: 'v2',
      title: 'ورشة التصميم الجرافيكي',
      description: 'تعلم أساسيات التصميم باستخدام Adobe Photoshop',
      category: 'learning',
      instructor: 'أ. سارة بن علي',
      date: '2025-11-17',
      time: '15:00',
      duration: 120,
      capacity: 100,
      registered: 87,
      status: 'upcoming',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    },
    {
      id: 'v3',
      title: 'جلسة تطوير الذات',
      description: 'استراتيجيات النجاح والتطوير الشخصي',
      category: 'social',
      instructor: 'د. محمد الطاهر',
      date: '2025-11-12',
      time: '19:00',
      duration: 60,
      capacity: 150,
      registered: 150,
      status: 'live',
      thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
      viewers: 132,
    },
    {
      id: 'v4',
      title: 'البرمجة بلغة Python',
      description: 'دورة متقدمة في البرمجة للمبتدئين',
      category: 'learning',
      instructor: 'م. يوسف كمال',
      date: '2025-11-20',
      time: '16:00',
      duration: 180,
      capacity: 80,
      registered: 45,
      status: 'upcoming',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    },
    {
      id: 'v5',
      title: 'ورشة التصوير الفوتوغرافي',
      description: 'تعلم فن التصوير الاحترافي والتحرير',
      category: 'learning',
      instructor: 'أ. نور الدين',
      date: '2025-11-18',
      time: '14:00',
      duration: 150,
      capacity: 60,
      registered: 52,
      status: 'upcoming',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
    },
    {
      id: 'v6',
      title: 'ندوة ريادة الأعمال',
      description: 'كيفية بدء مشروعك الخاص وتحويل الفكرة إلى واقع',
      category: 'social',
      instructor: 'د. فاطمة الزهراء',
      date: '2025-11-22',
      time: '17:00',
      duration: 90,
      capacity: 120,
      registered: 98,
      status: 'upcoming',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
    },
  ];

  const libraryResources = [
    {
      id: 'b1',
      title: 'دليل ريادة الأعمال للشباب',
      type: 'book',
      category: 'entrepreneurship',
      author: 'د. أحمد بن محمد',
      pages: 250,
      rating: 4.8,
      downloads: 1420,
      description: 'دليل شامل لبدء مشروعك الخاص',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop',
    },
    {
      id: 'b2',
      title: 'أساسيات البرمجة للمبتدئين',
      type: 'book',
      category: 'technology',
      author: 'م. سارة العربي',
      pages: 180,
      rating: 4.6,
      downloads: 2100,
      description: 'تعلم البرمجة من الصفر',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
    },
    {
      id: 'b3',
      title: 'فنون التواصل الفعال',
      type: 'book',
      category: 'social',
      author: 'د. خالد الأمين',
      pages: 220,
      rating: 4.7,
      downloads: 1680,
      description: 'تعلم مهارات التواصل والقيادة',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=300&fit=crop',
    },
    {
      id: 'c1',
      title: 'دورة التصوير الفوتوغرافي',
      type: 'course',
      category: 'arts',
      instructor: 'أ. محمد الطيب',
      duration: '12 ساعة',
      lessons: 24,
      rating: 4.9,
      enrolled: 890,
      description: 'تعلم فن التصوير الاحترافي',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1492446841529-9a0e75e79c84?w=200&h=300&fit=crop',
    },
    {
      id: 'c2',
      title: 'التسويق الرقمي للمبتدئين',
      type: 'course',
      category: 'entrepreneurship',
      instructor: 'د. فاطمة زهرة',
      duration: '8 ساعات',
      lessons: 16,
      rating: 4.7,
      enrolled: 1250,
      description: 'استراتيجيات التسويق الحديثة',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=300&fit=crop',
    },
    {
      id: 'c3',
      title: 'دورة تصميم الويب المتقدمة',
      type: 'course',
      category: 'technology',
      instructor: 'م. أمين حسان',
      duration: '16 ساعة',
      lessons: 32,
      rating: 4.8,
      enrolled: 1560,
      description: 'تعلم تصميم مواقع ويب حديثة واحترافية',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&h=300&fit=crop',
    },
    {
      id: 'b4',
      title: 'الإدارة المالية الشخصية',
      type: 'book',
      category: 'entrepreneurship',
      author: 'د. نور الدين',
      pages: 195,
      rating: 4.5,
      downloads: 980,
      description: 'كيفية إدارة أموالك بذكاء',
      price: 'مجاني',
      thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=300&fit=crop',
    },
  ];

  const skillsDevelopment = [
    {
      id: 's1',
      title: 'برنامج القيادة الشبابية',
      duration: '6 أسابيع',
      level: 'متقدم',
      participants: 245,
      thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    },
    {
      id: 's2',
      title: 'مهارات التواصل الفعال',
      duration: '4 أسابيع',
      level: 'مبتدئ',
      participants: 389,
      thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
    },
    {
      id: 's3',
      title: 'إدارة المشاريع',
      duration: '8 أسابيع',
      level: 'متوسط',
      participants: 167,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    },
    {
      id: 's4',
      title: 'التفكير النقدي وحل المشكلات',
      duration: '5 أسابيع',
      level: 'متوسط',
      participants: 298,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    },
    {
      id: 's5',
      title: 'الإبداع والابتكار',
      duration: '4 أسابيع',
      level: 'مبتدئ',
      participants: 412,
      thumbnail: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=400&h=300&fit=crop',
    },
    {
      id: 's6',
      title: 'القيادة الرقمية',
      duration: '6 أسابيع',
      level: 'متقدم',
      participants: 203,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      sports: 'bg-blue-500',
      learning: 'bg-green-500',
      social: 'bg-purple-500',
      environmental: 'bg-emerald-500',
      'e-sport': 'bg-red-500',
      entrepreneurship: 'bg-orange-500',
      technology: 'bg-cyan-500',
      arts: 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      technology: Code,
      arts: Palette,
      environmental: Leaf,
      'e-sport': Gamepad2,
      entrepreneurship: Briefcase,
      learning: GraduationCap,
      social: Users,
      sports: Award,
    };
    const Icon = icons[category] || Lightbulb;
    return <Icon className="w-4 h-4" />;
  };

  const handleUpvote = (suggestionId: string) => {
    setProjectSuggestions(prev => prev.map(s => {
      if (s.id === suggestionId) {
        const hasVoted = s.votedBy.includes(currentUserId);
        return {
          ...s,
          votes: hasVoted ? s.votes - 1 : s.votes + 1,
          votedBy: hasVoted 
            ? s.votedBy.filter(id => id !== currentUserId)
            : [...s.votedBy, currentUserId]
        };
      }
      return s;
    }));
  };

  const handleSubmitSuggestion = () => {
    if (!newSuggestion.title || !newSuggestion.description) return;

    const suggestion: ProjectSuggestion = {
      id: `ps${Date.now()}`,
      userId: currentUserId,
      userName: 'أنت',
      title: newSuggestion.title,
      description: newSuggestion.description,
      category: newSuggestion.category as any,
      targetAudience: newSuggestion.targetAudience,
      estimatedCost: newSuggestion.estimatedCost,
      duration: newSuggestion.duration,
      votes: 0,
      votedBy: [],
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      thumbnail: 'https://images.unsplash.com/photo-1507808425661-dec7b2114f15?w=400',
      comments: [],
    };

    setProjectSuggestions(prev => [suggestion, ...prev]);
    setShowNewSuggestionDialog(false);
    setNewSuggestion({
      title: '',
      description: '',
      category: 'learning',
      targetAudience: '',
      estimatedCost: '',
      duration: '',
    });
  };

  const sortedSuggestions = [...projectSuggestions]
    .sort((a, b) => b.votes - a.votes)
    .filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

  const topSuggestions = sortedSuggestions.slice(0, 5);

  const findNearestCenter = () => {
    // Sort centers by distance
    const sorted = [...mockCenters].sort((a, b) => (a.distance || 0) - (b.distance || 0));
    if (sorted.length > 0) {
      alert(`أقرب دار شباب: ${sorted[0].name}\nالمسافة: ${sorted[0].distance} كم\nالعنوان: ${sorted[0].address}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground p-6 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl">
              {t('دار الشباب الافتراضية', 'Virtual Youth Center', 'Maison de Jeunes Virtuelle')}
            </h1>
            <p className="text-sm opacity-90">
              {t('وطنية - للجميع', 'National - For Everyone', 'National - Pour tous')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm mt-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>2,450+ {t('عضو', 'members', 'membres')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>{projectSuggestions.length} {t('مشروع', 'projects', 'projets')}</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="px-4 -mt-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            onClick={() => setSelectedView('home')}
            variant={selectedView === 'home' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {t('الرئيسية', 'Home', 'Accueil')}
          </Button>
          <Button
            onClick={() => setSelectedView('suggestions')}
            variant={selectedView === 'suggestions' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {t('المشاريع', 'Projects', 'Projets')}
          </Button>
          <Button
            onClick={() => setSelectedView('library')}
            variant={selectedView === 'library' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t('المكتبة', 'Library', 'Bibliothèque')}
          </Button>
        </div>
      </div>

      {/* HOME VIEW - Horizontal Scrolling Sections */}
      {selectedView === 'home' && (
        <div className="space-y-6">
          {/* Top Projects Section */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t('المشاريع الأكثر تصويتاً', 'Top Voted Projects', 'Projets les plus votés')}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedView('suggestions')}
              >
                {t('الكل', 'All', 'Tous')}
                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {topSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="inline-block w-[280px] overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="h-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${suggestion.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <Badge className={`${getCategoryColor(suggestion.category)} mb-2`}>
                          <span className="mr-1">{getCategoryIcon(suggestion.category)}</span>
                          {suggestion.category}
                        </Badge>
                        <h3 className="text-sm text-white line-clamp-2">{suggestion.title}</h3>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{suggestion.targetAudience}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={suggestion.votedBy.includes(currentUserId) ? 'default' : 'outline'}
                          onClick={() => handleUpvote(suggestion.id)}
                          className="h-7"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {suggestion.votes}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Live & Upcoming Activities */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                {t('الأنشطة المباشرة والقادمة', 'Live & Upcoming', 'Direct et à venir')}
              </h2>
              <Button variant="ghost" size="sm">
                {t('الكل', 'All', 'Tous')}
                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {virtualActivities.map((activity) => (
                  <Card key={activity.id} className="inline-block w-[300px] overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <div 
                        className="h-36 bg-cover bg-center"
                        style={{ backgroundImage: `url(${activity.thumbnail})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        {activity.status === 'live' && (
                          <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            {t('مباشر', 'LIVE', 'DIRECT')}
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3">
                          <Badge className={getCategoryColor(activity.category)}>
                            {activity.category}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h3 className="text-sm mb-1">{activity.title}</h3>
                          <div className="flex items-center gap-2 text-xs opacity-90">
                            <GraduationCap className="w-3 h-3" />
                            <span>{activity.instructor}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>

                      {activity.status === 'live' && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>{activity.viewers} {t('مشاهد', 'viewers', 'spectateurs')}</span>
                        </div>
                      )}

                      <Button
                        onClick={() => activity.status === 'live' ? onJoinSession(activity.id) : onActivityClick(activity.id)}
                        variant={activity.status === 'live' ? 'default' : 'outline'}
                        size="sm"
                        className={`w-full ${activity.status === 'live' ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      >
                        {activity.status === 'live' 
                          ? t('انضم الآن', 'Join Now', 'Rejoindre')
                          : t('سجل', 'Register', 'S\'inscrire')
                        }
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Skills Development Programs */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-500" />
                {t('برامج تطوير المهارات', 'Skills Development', 'Développement des compétences')}
              </h2>
              <Button variant="ghost" size="sm">
                {t('الكل', 'All', 'Tous')}
                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {skillsDevelopment.map((program) => (
                  <Card key={program.id} className="inline-block w-[260px] overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="h-28 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${program.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm mb-2">{program.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{program.duration}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {program.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{program.participants} {t('مشترك', 'participants', 'participants')}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Featured Resources */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                {t('موارد مميزة', 'Featured Resources', 'Ressources en vedette')}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedView('library')}
              >
                {t('الكل', 'All', 'Tous')}
                <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {libraryResources.map((resource) => (
                  <Card key={resource.id} className="inline-block w-[200px] p-3 hover:shadow-lg transition-shadow">
                    <div 
                      className="w-full h-28 rounded-lg bg-cover bg-center shadow-md mb-2"
                      style={{ backgroundImage: `url(${resource.thumbnail})` }}
                    />
                    <h3 className="text-xs mb-1 line-clamp-2">{resource.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{resource.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.type === 'book' ? t('كتاب', 'Book', 'Livre') : t('دورة', 'Course', 'Cours')}
                    </Badge>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Nearby Centers */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                {t('دور الشباب القريبة', 'Nearby Centers', 'Centres à proximité')}
              </h2>
              <div className="text-xs text-muted-foreground">
                {t('أقرب دور الشباب', 'Nearest Centers', 'Centres les plus proches')}
              </div>
            </div>
            <div className="space-y-2">
              {mockCenters.slice(0, 5).map((center) => (
                <Card key={center.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <button
                        onClick={() => onCenterClick(center.id)}
                        className="text-sm mb-1 hover:underline text-left"
                      >
                        {center.name}
                      </button>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{center.distance} {t('كم', 'km', 'km')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{center.eta} {t('دقيقة', 'min', 'min')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>{center.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button 
                onClick={findNearestCenter}
                variant="outline" 
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('إظهار الأقرب', 'Show Nearest', 'Afficher le plus proche')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SUGGESTIONS VIEW */}
      {selectedView === 'suggestions' && (
        <div className="px-4 space-y-4">
          {/* Header with CTA */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm mb-1">
                  {t('شارك أفكارك مع المجتمع', 'Share Your Ideas', 'Partagez vos idées')}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {t(
                    'اقترح مشاريع وأنشطة جديدة. المشاريع الأكثر تصويتاً سيتم النظر فيها للتنفيذ',
                    'Suggest new projects and activities. Most voted projects will be considered',
                    'Proposez de nouveaux projets. Les plus votés seront considérés'
                  )}
                </p>
                <Dialog open={showNewSuggestionDialog} onOpenChange={setShowNewSuggestionDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('اقترح مشروع جديد', 'Suggest Project', 'Proposer un projet')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {t('اقترح مشروع جديد', 'New Project Suggestion', 'Nouveau projet')}
                      </DialogTitle>
                      <DialogDescription>
                        {t(
                          'شارك فكرتك مع المجتمع واحصل على دعم الأعضاء',
                          'Share your idea with the community and get support',
                          'Partagez votre idée avec la communauté'
                        )}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm mb-1 block">
                          {t('عنوان المشروع', 'Project Title', 'Titre du projet')}
                        </label>
                        <Input
                          value={newSuggestion.title}
                          onChange={(e) => setNewSuggestion({...newSuggestion, title: e.target.value})}
                          placeholder={t('مثال: مختبر الروبوتات للشباب', 'Ex: Youth Robotics Lab', 'Ex: Laboratoire de robotique')}
                        />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">
                          {t('الوصف', 'Description', 'Description')}
                        </label>
                        <Textarea
                          value={newSuggestion.description}
                          onChange={(e) => setNewSuggestion({...newSuggestion, description: e.target.value})}
                          placeholder={t('اشرح فكرة المشروع بالتفصيل...', 'Explain your project idea...', 'Expliquez votre idée...')}
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">
                          {t('الفئة', 'Category', 'Catégorie')}
                        </label>
                        <Select
                          value={newSuggestion.category}
                          onValueChange={(value) => setNewSuggestion({...newSuggestion, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="learning">{t('تعليمي', 'Learning', 'Éducatif')}</SelectItem>
                            <SelectItem value="sports">{t('رياضي', 'Sports', 'Sports')}</SelectItem>
                            <SelectItem value="social">{t('اجتماعي', 'Social', 'Social')}</SelectItem>
                            <SelectItem value="technology">{t('تكنولوجيا', 'Technology', 'Technologie')}</SelectItem>
                            <SelectItem value="arts">{t('فنون', 'Arts', 'Arts')}</SelectItem>
                            <SelectItem value="environmental">{t('بيئي', 'Environmental', 'Environnemental')}</SelectItem>
                            <SelectItem value="e-sport">{t('رياضة إلكترونية', 'E-Sport', 'E-Sport')}</SelectItem>
                            <SelectItem value="entrepreneurship">{t('ريادة أعمال', 'Entrepreneurship', 'Entrepreneuriat')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">
                          {t('الجمهور المستهدف', 'Target Audience', 'Public cible')}
                        </label>
                        <Input
                          value={newSuggestion.targetAudience}
                          onChange={(e) => setNewSuggestion({...newSuggestion, targetAudience: e.target.value})}
                          placeholder={t('مثال: الشباب 15-25 سنة', 'Ex: Youth 15-25 years', 'Ex: Jeunes 15-25 ans')}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm mb-1 block">
                            {t('المدة المقدرة', 'Duration', 'Durée')}
                          </label>
                          <Input
                            value={newSuggestion.duration}
                            onChange={(e) => setNewSuggestion({...newSuggestion, duration: e.target.value})}
                            placeholder={t('3 أشهر', '3 months', '3 mois')}
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-1 block">
                            {t('التكلفة المقدرة', 'Est. Cost', 'Coût est.')}
                          </label>
                          <Input
                            value={newSuggestion.estimatedCost}
                            onChange={(e) => setNewSuggestion({...newSuggestion, estimatedCost: e.target.value})}
                            placeholder={t('100,000 دج', '100,000 DA', '100,000 DA')}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSubmitSuggestion} className="w-full">
                        {t('إرسال الاقتراح', 'Submit Suggestion', 'Soumettre')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث في المشاريع...', 'Search projects...', 'Rechercher...')}
                className={language === 'ar' ? 'pr-10' : 'pl-10'}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('الكل', 'All', 'Tous')}</SelectItem>
                <SelectItem value="learning">{t('تعليمي', 'Learning', 'Éducatif')}</SelectItem>
                <SelectItem value="sports">{t('رياضي', 'Sports', 'Sports')}</SelectItem>
                <SelectItem value="technology">{t('تكنولوجيا', 'Technology', 'Technologie')}</SelectItem>
                <SelectItem value="arts">{t('فنون', 'Arts', 'Arts')}</SelectItem>
                <SelectItem value="environmental">{t('بيئي', 'Environmental', 'Environnemental')}</SelectItem>
                <SelectItem value="e-sport">{t('رياضة إلكترونية', 'E-Sport', 'E-Sport')}</SelectItem>
                <SelectItem value="entrepreneurship">{t('ريادة أعمال', 'Entrepreneurship', 'Entrepreneuriat')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3">
            {sortedSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  {/* Thumbnail */}
                  <div 
                    className="w-32 h-32 bg-cover bg-center flex-shrink-0 relative"
                    style={{ backgroundImage: `url(${suggestion.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <Badge className={`${getCategoryColor(suggestion.category)} text-xs`}>
                        <span className="mr-1">{getCategoryIcon(suggestion.category)}</span>
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{suggestion.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{suggestion.userName}</span>
                          <span>•</span>
                          <span>{suggestion.wilaya}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          suggestion.status === 'approved' ? 'border-green-500 text-green-600' :
                          suggestion.status === 'under_review' ? 'border-blue-500 text-blue-600' :
                          'border-gray-400 text-gray-600'
                        }
                      >
                        {suggestion.status === 'approved' ? t('معتمد', 'Approved', 'Approuvé') :
                         suggestion.status === 'under_review' ? t('قيد المراجعة', 'Under Review', 'En révision') :
                         t('معلق', 'Pending', 'En attente')}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {suggestion.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{suggestion.targetAudience}</span>
                        </div>
                        {suggestion.comments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{suggestion.comments.length}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-7">
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={suggestion.votedBy.includes(currentUserId) ? 'default' : 'outline'}
                          onClick={() => handleUpvote(suggestion.id)}
                          className="h-7 px-3"
                        >
                          <ThumbsUp className={`w-3 h-3 mr-1 ${suggestion.votedBy.includes(currentUserId) ? 'fill-current' : ''}`} />
                          {suggestion.votes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedSuggestions.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {t('لا توجد نتائج', 'No results found', 'Aucun résultat')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* LIBRARY VIEW */}
      {selectedView === 'library' && (
        <div className="px-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} w-4 h-4 text-muted-foreground`} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ابحث في المكتبة...', 'Search library...', 'Rechercher...')}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>

          {/* Info Banner */}
          <Card className="p-4 bg-primary/10 border-primary/20">
            <div className="flex items-start gap-3">
              <Unlock className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm mb-1 text-primary">
                  {t('موارد مجانية للشباب الجزائري', 'Free Resources for Algerian Youth', 'Ressources gratuites pour la jeunesse algérienne')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'جميع الكتب والدورات متاحة مجاناً كجزء من مبادرة دعم الشباب',
                    'All books and courses are free as part of the youth support initiative',
                    'Tous les livres et cours sont gratuits dans le cadre de l\'initiative de soutien à la jeunesse'
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Resources Grid */}
          <div className="space-y-3">
            {libraryResources.map((resource) => (
              <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-20 h-28 rounded-lg bg-cover bg-center shadow-md"
                      style={{ backgroundImage: `url(${resource.thumbnail})` }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm mb-1 line-clamp-1">{resource.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          {resource.type === 'book' ? (
                            <>
                              <FileText className="w-3 h-3" />
                              <span>{resource.author}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              <span>{resource.instructor}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {resource.type === 'book' ? t('كتاب', 'Book', 'Livre') : t('دورة', 'Course', 'Cours')}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span>{resource.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {resource.type === 'book' ? (
                            <>
                              <Download className="w-3 h-3" />
                              <span>{resource.downloads}</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-3 h-3" />
                              <span>{resource.enrolled}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        {resource.type === 'book' 
                          ? t('تحميل', 'Download', 'Télécharger')
                          : t('ابدأ', 'Start', 'Commencer')
                        }
                      </Button>
                    </div>

                    {/* Price tag */}
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      <Unlock className="w-3 h-3" />
                      <span>{resource.price}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}
