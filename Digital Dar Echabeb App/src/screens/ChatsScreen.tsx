import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  ArrowRight,
  MessageCircle,
  Hash,
  Lock,
  Users,
  Search,
  Plus,
  Pin,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import type { ChatChannel } from '../lib/types';

interface ChatsScreenProps {
  onBack: () => void;
  onChannelClick: (channelId: string) => void;
  onCreateChannel: () => void;
}

const MOCK_CHANNELS: ChatChannel[] = [
  {
    id: '1',
    name: 'عام - دار الشباب المركزي',
    type: 'public',
    centerId: '1',
    centerName: 'دار الشباب المركزي',
    memberCount: 234,
    unreadCount: 3,
    lastMessage: {
      id: '1',
      userId: '1',
      userName: 'أحمد محمد',
      text: 'مرحباً بالجميع في القناة العامة',
      timestamp: '14:30',
      state: 'read',
    },
  },
  {
    id: '2',
    name: 'نادي البرمجة',
    type: 'public',
    centerId: '1',
    memberCount: 56,
    unreadCount: 12,
    lastMessage: {
      id: '2',
      userId: '2',
      userName: 'فاطمة علي',
      text: 'هل يمكن مشاركة كود المشروع؟',
      timestamp: '15:10',
      state: 'read',
    },
  },
  {
    id: '3',
    name: 'فريق كرة القدم',
    type: 'private',
    memberCount: 22,
    unreadCount: 0,
    isLocked: true,
    lastMessage: {
      id: '3',
      userId: '3',
      userName: 'كريم العربي',
      text: 'التدريب غداً الساعة 16:00',
      timestamp: '13:45',
      state: 'read',
    },
  },
  {
    id: '4',
    name: 'نادي الموسيقى',
    type: 'public',
    memberCount: 89,
    unreadCount: 5,
    isMuted: true,
    lastMessage: {
      id: '4',
      userId: '4',
      userName: 'سارة قاسم',
      text: 'الحفل القادم يوم الجمعة',
      timestamp: '12:20',
      state: 'read',
    },
  },
];

const MOCK_DMS: ChatChannel[] = [
  {
    id: 'dm1',
    name: 'أحمد محمود',
    type: 'dm',
    memberCount: 2,
    unreadCount: 2,
    lastMessage: {
      id: 'dm1-1',
      userId: '1',
      userName: 'أحمد محمود',
      text: 'شكراً على المساعدة!',
      timestamp: '16:45',
      state: 'delivered',
    },
  },
  {
    id: 'dm2',
    name: 'فاطمة بن علي',
    type: 'dm',
    memberCount: 2,
    unreadCount: 0,
    lastMessage: {
      id: 'dm2-1',
      userId: '2',
      userName: 'أنت',
      text: 'حسناً، نتحدث لاحقاً',
      timestamp: '15:30',
      state: 'read',
    },
  },
];

export function ChatsScreen({ onBack, onChannelClick, onCreateChannel }: ChatsScreenProps) {
  const { t } = useApp();
  const [selectedTab, setSelectedTab] = useState('channels');
  const [searchQuery, setSearchQuery] = useState('');

  const filterChannels = (channels: ChatChannel[]) => {
    if (!searchQuery.trim()) return channels;
    return channels.filter((channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const publicChannels = filterChannels(MOCK_CHANNELS.filter((c) => c.type === 'public'));
  const privateChannels = filterChannels(MOCK_CHANNELS.filter((c) => c.type === 'private'));
  const dms = filterChannels(MOCK_DMS);

  const totalUnread =
    MOCK_CHANNELS.reduce((sum, ch) => sum + ch.unreadCount, 0) +
    MOCK_DMS.reduce((sum, dm) => sum + dm.unreadCount, 0);

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
              <MessageCircle className="h-6 w-6 text-primary" />
              <h1>{t('المحادثات', 'Chats', 'Discussions')}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCreateChannel} className="h-11 w-11">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('بحث في المحادثات...', 'Search chats...', 'Rechercher...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-1 flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none">
          <TabsTrigger value="channels">
            {t('القنوات', 'Channels', 'Canaux')}
            {MOCK_CHANNELS.reduce((sum, ch) => sum + ch.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="mr-2 h-5 min-w-[20px] px-1">
                {MOCK_CHANNELS.reduce((sum, ch) => sum + ch.unreadCount, 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="private">
            {t('خاص', 'Private', 'Privé')}
            {privateChannels.reduce((sum, ch) => sum + ch.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="mr-2 h-5 min-w-[20px] px-1">
                {privateChannels.reduce((sum, ch) => sum + ch.unreadCount, 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="dms">
            {t('مباشر', 'Direct', 'Direct')}
            {MOCK_DMS.reduce((sum, dm) => sum + dm.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="mr-2 h-5 min-w-[20px] px-1">
                {MOCK_DMS.reduce((sum, dm) => sum + dm.unreadCount, 0)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="channels" className="m-0">
            <div className="divide-y divide-border">
              {publicChannels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  onClick={() => onChannelClick(channel.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="private" className="m-0">
            <div className="divide-y divide-border">
              {privateChannels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  onClick={() => onChannelClick(channel.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dms" className="m-0">
            <div className="divide-y divide-border">
              {dms.map((dm) => (
                <ChannelItem key={dm.id} channel={dm} onClick={() => onChannelClick(dm.id)} />
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

interface ChannelItemProps {
  channel: ChatChannel;
  onClick: () => void;
}

function ChannelItem({ channel, onClick }: ChannelItemProps) {
  const { t } = useApp();

  const getIcon = () => {
    if (channel.type === 'dm') {
      return (
        <Avatar className="h-12 w-12">
          <AvatarFallback>{channel.name[0]}</AvatarFallback>
        </Avatar>
      );
    }
    if (channel.type === 'private') {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
      );
    }
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Hash className="h-6 w-6 text-primary" />
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50"
    >
      <div className="relative shrink-0">
        {getIcon()}
        {channel.unreadCount > 0 && (
          <div className="absolute -left-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs text-white">
            {channel.unreadCount}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm">{channel.name}</h3>
            {channel.isMuted && <VolumeX className="h-4 w-4 text-muted-foreground" />}
            {channel.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
          {channel.lastMessage && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {channel.lastMessage.timestamp}
            </span>
          )}
        </div>
        {channel.lastMessage && (
          <p className="truncate text-sm text-muted-foreground">
            {channel.type === 'dm' && channel.lastMessage.userName === 'أنت' && (
              <span className="ml-1">{t('أنت:', 'You:', 'Vous:')}</span>
            )}
            {channel.lastMessage.text}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{channel.memberCount}</span>
          </div>
          {channel.centerName && <span>• {channel.centerName}</span>}
        </div>
      </div>
    </div>
  );
}
