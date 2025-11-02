import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  ArrowRight,
  Send,
  Paperclip,
  Image as ImageIcon,
  Pin,
  MoreVertical,
  Reply,
  Users,
  Settings,
  Check,
  CheckCheck,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { ChatMessage } from '../lib/types';

interface ChatRoomScreenProps {
  channelId: string;
  onBack: () => void;
  onShowMembers: () => void;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمود',
    text: 'مرحباً بالجميع! أهلاً بكم في قناة البرمجة',
    timestamp: '2025-11-02T10:00:00',
    isPinned: true,
    state: 'read',
  },
  {
    id: '2',
    userId: '2',
    userName: 'فاطمة علي',
    text: 'شكراً @أحمد محمود على الترحيب',
    timestamp: '2025-11-02T10:05:00',
    mentions: ['أحمد محمود'],
    state: 'read',
  },
  {
    id: '3',
    userId: '3',
    userName: 'كريم العربي',
    text: 'هل يمكن مشاركة ملف المشروع؟',
    timestamp: '2025-11-02T10:10:00',
    state: 'read',
  },
  {
    id: '4',
    userId: '1',
    userName: 'أحمد محمود',
    text: 'بالتأكيد! هنا الملف',
    timestamp: '2025-11-02T10:12:00',
    replyToId: '3',
    attachments: [
      { type: 'file', url: '#', name: 'project-guide.pdf' },
    ],
    state: 'read',
  },
  {
    id: '5',
    userId: '4',
    userName: 'سارة قاسم',
    text: 'صورة من التدريب اليوم',
    timestamp: '2025-11-02T10:15:00',
    attachments: [
      { type: 'image', url: '#', name: 'training.jpg' },
    ],
    state: 'read',
  },
  {
    id: '6',
    userId: 'me',
    userName: 'أنت',
    text: 'رائع! شكراً للجميع',
    timestamp: '2025-11-02T10:20:00',
    state: 'delivered',
  },
];

export function ChatRoomScreen({ channelId, onBack, onShowMembers }: ChatRoomScreenProps) {
  const { t } = useApp();
  const [messageText, setMessageText] = useState('');
  const [messages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    toast.success(t('تم إرسال الرسالة', 'Message sent', 'Message envoyé'));
    setMessageText('');
    setReplyingTo(null);
  };

  const handleAttachment = () => {
    toast.info(t('اختر ملف', 'Select file', 'Sélectionner un fichier'));
  };

  const handlePinMessage = (messageId: string) => {
    toast.success(t('تم تثبيت الرسالة', 'Message pinned', 'Message épinglé'));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
  };

  const getReplyMessage = (replyToId: string) => {
    return messages.find((m) => m.id === replyToId);
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
              <h2>نادي البرمجة</h2>
              <p className="text-xs text-muted-foreground">
                {t('56 عضو', '56 members', '56 membres')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onShowMembers} className="h-11 w-11">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-11 w-11">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Pinned Message */}
        {messages.some((m) => m.isPinned) && (
          <div className="border-t border-border bg-muted/30 px-4 py-2">
            <div className="flex items-start gap-2">
              <Pin className="h-4 w-4 shrink-0 rotate-45 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {t('رسالة مثبتة', 'Pinned message', 'Message épinglé')}
                </p>
                <p className="line-clamp-1 text-sm">
                  {messages.find((m) => m.isPinned)?.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onReply={() => setReplyingTo(message)}
              onPin={() => handlePinMessage(message.id)}
              formatTime={formatTime}
              getReplyMessage={getReplyMessage}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="border-t border-border bg-muted/30 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Reply className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t('الرد على', 'Replying to', 'Répondre à')}
              </span>
              <span>{replyingTo.userName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-8 px-2"
            >
              {t('إلغاء', 'Cancel', 'Annuler')}
            </Button>
          </div>
          <p className="mr-6 line-clamp-1 text-sm text-muted-foreground">{replyingTo.text}</p>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleAttachment} className="h-11 w-11 shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder={t('اكتب رسالة...', 'Type a message...', 'Écrire un message...')}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" className="h-11 w-11 shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MessageItemProps {
  message: ChatMessage;
  onReply: () => void;
  onPin: () => void;
  formatTime: (timestamp: string) => string;
  getReplyMessage: (id: string) => ChatMessage | undefined;
}

function MessageItem({ message, onReply, onPin, formatTime, getReplyMessage }: MessageItemProps) {
  const { t } = useApp();
  const isOwnMessage = message.userId === 'me';
  const replyMessage = message.replyToId ? getReplyMessage(message.replyToId) : null;

  const getStateIcon = () => {
    if (message.state === 'sent') return <Check className="h-3 w-3" />;
    if (message.state === 'delivered') return <CheckCheck className="h-3 w-3" />;
    if (message.state === 'read') return <CheckCheck className="h-3 w-3 text-primary" />;
    return null;
  };

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {!isOwnMessage && (
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{message.userName[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex-1 ${isOwnMessage ? 'items-end' : ''}`}>
        {!isOwnMessage && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm">{message.userName}</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          </div>
        )}
        
        {/* Reply Reference */}
        {replyMessage && (
          <div className="mb-1 rounded-lg border-r-2 border-primary bg-muted/50 p-2 text-sm">
            <p className="text-xs text-muted-foreground">{replyMessage.userName}</p>
            <p className="line-clamp-1 text-muted-foreground">{replyMessage.text}</p>
          </div>
        )}

        <div className={`group relative ${isOwnMessage ? 'text-left' : ''}`}>
          <div
            className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
              isOwnMessage
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border'
            }`}
          >
            <p className="break-words text-sm">{message.text}</p>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded p-2 ${
                      isOwnMessage ? 'bg-primary-foreground/10' : 'bg-muted'
                    }`}
                  >
                    {attachment.type === 'image' ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                    <span className="flex-1 truncate text-xs">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {isOwnMessage && (
              <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                <span>{formatTime(message.timestamp)}</span>
                {getStateIcon()}
              </div>
            )}
          </div>

          {/* Message Actions */}
          {!isOwnMessage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -left-2 top-0 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={onReply}>
                  <Reply className="ml-2 h-4 w-4" />
                  {t('رد', 'Reply', 'Répondre')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPin}>
                  <Pin className="ml-2 h-4 w-4" />
                  {t('تثبيت', 'Pin', 'Épingler')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
