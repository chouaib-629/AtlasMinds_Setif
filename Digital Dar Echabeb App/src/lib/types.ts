export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  wilaya: string;
  age: number;
  points: number;
  streak: number;
  level: 'Rookie' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  badges: Badge[];
  avatar?: string;
  interests?: string[];
  registeredCenterId?: string;
}

export interface Center {
  id: string;
  name: string;
  wilaya: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  eta?: number;
  image?: string;
  rating: number;
  capacity: number;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  memberCount?: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  centerId: string;
  centerName: string;
  category: 'sports' | 'learning' | 'social' | 'environmental' | 'e-sport';
  type: 'free' | 'paid' | 'virtual';
  price?: number;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  registered: number;
  waitlist: number;
  image?: string;
  instructor?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
}

export interface Registration {
  id: string;
  activityId: string;
  userId: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  qrCode: string;
  attendanceScanned: boolean;
  paymentStatus?: 'pending' | 'completed' | 'failed';
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  wilaya: string;
  votes: number;
  votedBy: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal';
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  earned: boolean;
  earnedAt?: string;
  fragments?: number;
  totalFragments?: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: 'priority' | 'voucher' | 'equipment';
  cost: number;
  image?: string;
  available: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  nom: string;
  prenom: string;
  wilaya: string;
  commune?: string;
  score: number;
  attended_events_count: number;
}

export interface VolunteerAssignment {
  id: string;
  activityId: string;
  activityTitle: string;
  date: string;
  time: string;
  hours: number;
  status: 'upcoming' | 'checked-in' | 'completed';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'announcement' | 'achievement' | 'reward';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  centerId: string;
  centerName: string;
  category: 'workshop' | 'e-sport' | 'vr' | 'concert' | 'discussion';
  hostName: string;
  hostAvatar?: string;
  scheduledTime: string;
  status: 'upcoming' | 'live' | 'ended';
  viewerCount: number;
  thumbnail?: string;
  duration?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
  replyToId?: string;
  attachments?: { type: 'image' | 'file'; url: string; name: string }[];
  mentions?: string[];
  state: 'sent' | 'delivered' | 'read';
  isPinned?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'dm';
  centerId?: string;
  centerName?: string;
  avatar?: string;
  memberCount: number;
  unreadCount: number;
  lastMessage?: ChatMessage;
  isMuted?: boolean;
  isLocked?: boolean;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  memberCount: number;
  visibility: 'public' | 'private';
  admins: string[];
  moderators: string[];
  rules?: string[];
  centerId?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  centerId: string;
  centerName: string;
  representativeName: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ProjectSuggestion {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  category: 'sports' | 'learning' | 'social' | 'environmental' | 'e-sport' | 'arts' | 'technology' | 'entrepreneurship';
  targetAudience: string;
  estimatedCost?: string;
  duration?: string;
  votes: number;
  votedBy: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  wilaya?: string;
  thumbnail?: string;
  comments: Comment[];
}

export interface AdminKPI {
  totalActivities: number;
  totalParticipants: number;
  averageAttendance: number;
  pendingApprovals: number;
  activeVolunteers: number;
}
