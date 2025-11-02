import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import {
  ArrowRight,
  Maximize2,
  Users,
  Send,
  Heart,
  ThumbsUp,
  Sparkles,
  WifiOff,
  Gift,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

interface LivePlayerScreenProps {
  sessionId: string;
  onBack: () => void;
  onMinimize?: () => void;
}

interface ChatMessageType {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export function LivePlayerScreen({ sessionId, onBack, onMinimize }: LivePlayerScreenProps) {
  const { t } = useApp();
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { id: '1', userName: 'أحمد محمد', text: 'مرحباً بالجميع!', timestamp: '14:05' },
    { id: '2', userName: 'فاطمة علي', text: 'شكراً على الورشة الرائعة', timestamp: '14:06' },
    { id: '3', userName: 'كريم العربي', text: 'هل يمكن إعادة الشرح الأخير؟', timestamp: '14:07' },
  ]);
  const [showLiveDrop, setShowLiveDrop] = useState(false);
  const [hasNetworkIssue, setHasNetworkIssue] = useState(false);
  const [viewerCount] = useState(142);

  // Simulate Live Drop appearing after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLiveDrop(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate random network issues
  useEffect(() => {
    const interval = setInterval(() => {
      setHasNetworkIssue(Math.random() < 0.1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      userName: 'أنت',
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleReaction = (type: string) => {
    toast.success(t('تم إرسال التفاعل', 'Reaction sent', 'Réaction envoyée'));
  };

  const handleClaimLiveDrop = () => {
    setShowLiveDrop(false);
    toast.success(t('تم الحصول على 50 نقطة!', 'Earned 50 points!', '50 points gagnés!'));
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
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                <span className="text-sm">{t('مباشر', 'LIVE', 'EN DIRECT')}</span>
              </div>
              <h2 className="text-sm">ورشة البرمجة المباشرة</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded bg-muted px-2 py-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">{viewerCount}</span>
            </div>
            {onMinimize && (
              <Button variant="ghost" size="icon" onClick={onMinimize} className="h-11 w-11">
                <Maximize2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Network Issue Banner */}
      {hasNetworkIssue && (
        <div className="flex items-center gap-2 bg-warning px-4 py-2 text-warning-foreground">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">
            {t('اتصال ضعيف - جودة منخفضة', 'Weak connection - Low quality', 'Connexion faible - Basse qualité')}
          </span>
        </div>
      )}

      {/* Video Area */}
      <div className="relative aspect-video bg-black">
        <div className="flex h-full items-center justify-center">
          <div className="rounded-lg bg-card/10 p-8 text-center text-white backdrop-blur-sm">
            <div className="mb-2 h-12 w-12 animate-pulse rounded-full bg-destructive/50" />
            <p className="text-sm">{t('البث المباشر', 'Live Stream', 'Stream en direct')}</p>
          </div>
        </div>
        {/* Host Badge */}
        <div className="absolute bottom-4 left-4 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>أم</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span>{t('المقدم:', 'Host:', 'Hôte:')}</span>
              <span className="mr-1">أحمد محمود</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reactions Row */}
      <div className="border-b border-border bg-card p-3">
        <div className="flex items-center justify-around gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('heart')}
            className="flex-1 gap-2"
          >
            <Heart className="h-5 w-5 text-destructive" />
            <span className="text-sm">{t('حب', 'Love', 'Cœur')}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('like')}
            className="flex-1 gap-2"
          >
            <ThumbsUp className="h-5 w-5 text-primary" />
            <span className="text-sm">{t('إعجاب', 'Like', 'J\'aime')}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('sparkle')}
            className="flex-1 gap-2"
          >
            <Sparkles className="h-5 w-5 text-warning" />
            <span className="text-sm">{t('رائع', 'Amazing', 'Génial')}</span>
          </Button>
        </div>
      </div>

      {/* Live Chat */}
      <div className="flex flex-1 flex-col bg-muted/30">
        <div className="border-b border-border bg-card px-4 py-3">
          <h3 className="text-sm">{t('الدردشة المباشرة', 'Live Chat', 'Chat en direct')}</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs">{msg.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="text-sm">{msg.userName}</span>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="rounded-lg bg-card px-3 py-2 text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-border bg-card p-4">
          <div className="flex gap-2">
            <Input
              placeholder={t('اكتب رسالة...', 'Type a message...', 'Écrire un message...')}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" className="h-11 w-11 shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Live Drop Modal */}
      <Dialog open={showLiveDrop} onOpenChange={setShowLiveDrop}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <Gift className="h-6 w-6 text-accent" />
              {t('جائزة مباشرة!', 'Live Drop!', 'Cadeau Live!')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
                <Gift className="h-10 w-10 text-accent" />
              </div>
            </div>
            <p className="mb-6 text-lg">
              {t('احصل على 50 نقطة لمشاهدتك!', 'Get 50 points for watching!', 'Gagnez 50 points!')}
            </p>
            <Button onClick={handleClaimLiveDrop} className="w-full">
              {t('احصل على الجائزة', 'Claim Reward', 'Récupérer')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Mini Player Component (overlay when navigating away)
export function MiniLivePlayer({ onExpand, onClose }: { onExpand: () => void; onClose: () => void }) {
  const { t } = useApp();
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 rounded-lg border border-border bg-card shadow-2xl">
      <div className="flex items-center gap-2 p-2">
        <div className="aspect-video h-16 flex-shrink-0 rounded bg-black">
          <div className="flex h-full items-center justify-center">
            <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
          </div>
        </div>
        <div className="flex-1" onClick={onExpand}>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
            <span>{t('مباشر', 'LIVE', 'EN DIRECT')}</span>
          </div>
          <p className="text-sm">ورشة البرمجة المباشرة</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
