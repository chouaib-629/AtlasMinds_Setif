import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ArrowLeft, ArrowRight, Users, MessageCircle, Heart, Smile, ThumbsUp, Send, Gift, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

interface VirtualHallScreenProps {
  activityId: string;
  onBack: () => void;
}

export function VirtualHallScreen({ activityId, onBack }: VirtualHallScreenProps) {
  const { t, language } = useApp();
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'أحمد', text: 'مرحباً بالجميع!', time: '14:30' },
    { id: '2', user: 'فاطمة', text: 'سعيدة بالانضمام', time: '14:31' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [viewerCount] = useState(145);
  const [showLiveDrop, setShowLiveDrop] = useState(false);
  const [networkIssue, setNetworkIssue] = useState(false);

  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  useEffect(() => {
    // Simulate live drop after 5 seconds
    const timer = setTimeout(() => {
      setShowLiveDrop(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([...messages, {
      id: Date.now().toString(),
      user: t('أنت', 'You'),
      text: newMessage,
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  const handleReaction = (reaction: string) => {
    toast.success(reaction);
  };

  const handleClaimDrop = () => {
    setShowLiveDrop(false);
    toast.success(t('تم استلام المكافأة: +50 نقطة', 'Reward claimed: +50 points'));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20">
            <BackIcon className="w-6 h-6" />
          </button>
          <Badge className="bg-red-500 text-white flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {t('مباشر', 'LIVE')}
          </Badge>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{viewerCount}</span>
          </div>
        </div>
        <h3>{t('ندوة القيادة الشبابية', 'Youth Leadership Seminar')}</h3>
      </div>

      {/* Video/Live Area */}
      <div className="relative flex-1 bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Placeholder for video */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Users className="w-16 h-16" />
              </div>
              <p className="text-xl">{t('البث المباشر جاري', 'Live Stream in Progress')}</p>
            </div>
          </div>
        </div>

        {/* Network Issue Banner */}
        {networkIssue && (
          <div className="absolute top-4 left-4 right-4 bg-warning/90 text-warning-foreground px-4 py-2 rounded-lg flex items-center gap-2">
            <WifiOff className="w-5 h-5" />
            <p>{t('ضعف الاتصال بالإنترنت', 'Weak network connection')}</p>
          </div>
        )}

        {/* Reaction Buttons */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          {[
            { icon: Heart, color: 'text-red-500' },
            { icon: ThumbsUp, color: 'text-blue-500' },
            { icon: Smile, color: 'text-yellow-500' },
          ].map((reaction, i) => {
            const Icon = reaction.icon;
            return (
              <button
                key={i}
                onClick={() => handleReaction(reaction.icon.name)}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <Icon className={`w-6 h-6 ${reaction.color}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="h-64 bg-card border-t border-border flex flex-col">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h4>{t('الدردشة المباشرة', 'Live Chat')}</h4>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs">{msg.user[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('اكتب رسالة...', 'Type a message...')}
            />
            <Button type="submit" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Live Drop Modal */}
      <Dialog open={showLiveDrop} onOpenChange={setShowLiveDrop}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t('🎁 مكافأة مباشرة!', '🎁 Live Drop!')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white text-center space-y-3">
              <Gift className="w-16 h-16 mx-auto" />
              <h2>+50</h2>
              <p>{t('نقطة مكافأة', 'Bonus Points')}</p>
            </div>

            <p className="text-center text-muted-foreground">
              {t('شكراً لمشاركتك في البث المباشر!', 'Thanks for joining the live stream!')}
            </p>

            <Button onClick={handleClaimDrop} className="w-full" size="lg">
              {t('استلام المكافأة', 'Claim Reward')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
