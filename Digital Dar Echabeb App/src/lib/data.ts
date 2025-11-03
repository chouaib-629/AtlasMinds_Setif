import { Activity, Center, Quest, Badge, Reward, Suggestion, LeaderboardEntry, VolunteerAssignment, Notification, ProjectSuggestion, VolunteeringProject, Club } from './types';

export const mockCenters: Center[] = [
  {
    id: '1',
    name: 'دار الشباب المركزي',
    wilaya: 'الجزائر',
    address: 'حي بئر مراد رايس',
    lat: 36.7538,
    lng: 3.0588,
    distance: 1.2,
    eta: 15,
    rating: 4.5,
    capacity: 300,
  },
  {
    id: '2',
    name: 'دار الشباب وهران',
    wilaya: 'وهران',
    address: 'حي السانيا',
    lat: 35.6976,
    lng: -0.6337,
    distance: 2.5,
    eta: 25,
    rating: 4.7,
    capacity: 250,
  },
  {
    id: '3',
    name: 'دار الشباب قسنطينة',
    wilaya: 'قسنطينة',
    address: 'وسط المدينة',
    lat: 36.3650,
    lng: 6.6147,
    distance: 3.0,
    eta: 30,
    rating: 4.6,
    capacity: 200,
  },
  {
    id: '4',
    name: 'دار الشباب عنابة',
    wilaya: 'عنابة',
    address: 'حي الهضاب',
    lat: 36.9077,
    lng: 7.7675,
    distance: 4.2,
    eta: 35,
    rating: 4.4,
    capacity: 180,
  },
  {
    id: '5',
    name: 'دار الشباب تيزي وزو',
    wilaya: 'تيزي وزو',
    address: 'حي أولاد فايد',
    lat: 36.7128,
    lng: 4.0503,
    distance: 5.5,
    eta: 42,
    rating: 4.8,
    capacity: 220,
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'ورشة البرمجة للمبتدئين',
    description: 'تعلم أساسيات البرمجة مع Python في بيئة تفاعلية',
    centerId: '1',
    centerName: 'دار الشباب المركزي',
    category: 'learning',
    type: 'free',
    date: '2025-11-08',
    time: '14:00',
    duration: 120,
    capacity: 30,
    registered: 22,
    waitlist: 5,
    instructor: 'أ. محمد بن علي',
  },
  {
    id: '2',
    title: 'بطولة كرة القدم الخماسية',
    description: 'دوري شبابي أسبوعي - سجل فريقك الآن',
    centerId: '1',
    centerName: 'دار الشباب المركزي',
    category: 'sports',
    type: 'paid',
    price: 500,
    date: '2025-11-10',
    time: '16:00',
    duration: 180,
    capacity: 40,
    registered: 35,
    waitlist: 8,
  },
  {
    id: '3',
    title: 'حملة تنظيف الشاطئ',
    description: 'مبادرة بيئية لتنظيف الشواطئ المحلية',
    centerId: '2',
    centerName: 'دار الشباب وهران',
    category: 'environmental',
    type: 'free',
    date: '2025-11-12',
    time: '08:00',
    duration: 240,
    capacity: 50,
    registered: 18,
    waitlist: 0,
  },
  {
    id: '4',
    title: 'ندوة القيادة الشبابية',
    description: 'لقاء تفاعلي مع قادة محليين ومتحدثين ملهمين',
    centerId: '3',
    centerName: 'دار الشباب قسنطينة',
    category: 'social',
    type: 'virtual',
    date: '2025-11-15',
    time: '18:00',
    duration: 90,
    capacity: 200,
    registered: 145,
    waitlist: 12,
  },
];

export const mockQuests: Quest[] = [
  {
    id: '1',
    title: 'شارك في 3 أنشطة',
    description: 'احضر 3 أنشطة مختلفة في هذا الأسبوع',
    type: 'weekly',
    progress: 2,
    total: 3,
    reward: 150,
    completed: false,
  },
  {
    id: '2',
    title: 'انضم لنادي جديد',
    description: 'انضم إلى نادي لم تكن عضواً فيه من قبل',
    type: 'daily',
    progress: 0,
    total: 1,
    reward: 50,
    completed: false,
  },
  {
    id: '3',
    title: 'شارك في نقاش',
    description: 'اكتب 5 مشاركات في منتديات النقاش',
    type: 'weekly',
    progress: 3,
    total: 5,
    reward: 100,
    completed: false,
  },
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'المشارك النشط',
    description: 'شارك في 10 أنشطة',
    icon: '🏆',
    tier: 'Bronze',
    earned: true,
    earnedAt: '2025-10-15',
  },
  {
    id: '2',
    name: 'قائد المجتمع',
    description: 'أنشئ نادياً جديداً',
    icon: '👑',
    tier: 'Gold',
    earned: false,
    fragments: 3,
    totalFragments: 5,
  },
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'قسيمة مطعم',
    description: 'خصم 20% في مطعم محلي',
    category: 'voucher',
    cost: 200,
    available: true,
  },
  {
    id: '2',
    title: 'الأولوية في التسجيل',
    description: 'احجز قبل الآخرين في الأنشطة',
    category: 'priority',
    cost: 300,
    available: true,
  },
  {
    id: '3',
    title: 'إعارة معدات رياضية',
    description: 'استعر معدات رياضية لمدة أسبوع',
    category: 'equipment',
    cost: 150,
    available: true,
  },
  {
    id: '4',
    title: 'تذكرة ورشة متقدمة',
    description: 'وصول حصري لورشة متقدمة',
    category: 'priority',
    cost: 500,
    available: false,
  },
];

export const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمد',
    title: 'ورشة تصوير فوتوغرافي',
    description: 'نحتاج لورشة تعليم التصوير الفوتوغرافي للمبتدئين',
    category: 'learning',
    wilaya: 'الجزائر',
    votes: 47,
    votedBy: ['2', '3', '4'],
    status: 'approved',
    createdAt: '2025-10-25',
    comments: [
      {
        id: '1',
        userId: '2',
        userName: 'فاطمة علي',
        text: 'فكرة ممتازة! أنا مهتمة',
        createdAt: '2025-10-26',
      },
    ],
  },
  {
    id: '2',
    userId: '2',
    userName: 'سارة خالد',
    title: 'نادي الكتاب الشهري',
    description: 'لقاء شهري لمناقشة كتاب محدد',
    category: 'social',
    wilaya: 'الجزائر',
    votes: 32,
    votedBy: ['1', '3'],
    status: 'pending',
    createdAt: '2025-10-27',
    comments: [],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user_id: 1, nom: 'أحمد', prenom: 'محمد', wilaya: 'الجزائر', score: 2850, attended_events_count: 42 },
  { rank: 2, user_id: 2, nom: 'فاطمة', prenom: 'علي', wilaya: 'وهران', score: 2720, attended_events_count: 38 },
  { rank: 3, user_id: 3, nom: 'محمد', prenom: 'حسن', wilaya: 'قسنطينة', score: 2650, attended_events_count: 35 },
];

export const mockVolunteerAssignments: VolunteerAssignment[] = [
  {
    id: '1',
    activityId: '3',
    activityTitle: 'حملة تنظيف الشاطئ',
    date: '2025-11-12',
    time: '08:00',
    hours: 4,
    status: 'upcoming',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'تذكير: ورشة البرمجة غداً',
    message: 'ورشة البرمجة للمبتدئين ستكون غداً في الساعة 14:00',
    read: false,
    createdAt: '2025-11-07T10:00:00',
  },
  {
    id: '2',
    type: 'achievement',
    title: 'مكسب جديد!',
    message: 'لقد ربحت شارة "المشارك النشط"',
    read: false,
    createdAt: '2025-11-06T15:30:00',
  },
];

export const mockProjectSuggestions: ProjectSuggestion[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمد',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    title: 'مشروع تطوير تطبيق محلي',
    description: 'تطوير تطبيق جوال يربط الشباب بالأنشطة المحلية',
    category: 'technology',
    targetAudience: 'الشباب من 18-30 سنة',
    estimatedCost: '500,000 دج',
    duration: '6 أشهر',
    votes: 89,
    votedBy: ['2', '3', '4', '5'],
    status: 'approved',
    createdAt: '2025-10-20',
    updatedAt: '2025-10-25',
    wilaya: 'الجزائر',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    comments: [],
  },
];

export const mockClubs: Club[] = [
  // Support Clubs (دعم وتأهيل)
  {
    id: 'support-1',
    name: 'نادي الدعم للتغلب على الإدمان',
    description: 'مجموعة دعم آمنة للشباب الذين يواجهون تحديات الإدمان. نوفر بيئة آمنة ومهنية للمشاركة والدعم المتبادل مع مرشدين متخصصين.',
    category: 'support-addiction',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop',
    memberCount: 45,
    visibility: 'public',
    admins: ['admin-1'],
    moderators: ['mod-1', 'mod-2'],
    rules: [
      'السرية التامة للمعلومات المتبادلة',
      'الاحترام المتبادل بين جميع الأعضاء',
      'عدم التمييز أو الإساءة لأي عضو',
      'الحضور المنتظم للجلسات',
    ],
    centerId: '1',
  },
  {
    id: 'support-2',
    name: 'نادي الشباب ذوي الإعاقة',
    description: 'مجتمع داعم للشباب ذوي الإعاقات المختلفة. نركز على الدمج الاجتماعي، تطوير المهارات، والتوعية بحقوق الأشخاص ذوي الإعاقة.',
    category: 'support-disability',
    coverImage: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=400&fit=crop',
    memberCount: 62,
    visibility: 'public',
    admins: ['admin-2'],
    moderators: ['mod-3'],
    rules: [
      'الدعم والاحترام لجميع الأعضاء',
      'توفير بيئة شاملة ومتاحة للجميع',
      'التوعية بحقوق الأشخاص ذوي الإعاقة',
      'المشاركة الفعالة في الأنشطة',
    ],
    centerId: '1',
  },
  {
    id: 'support-3',
    name: 'مجموعة الدعم النفسي للشباب',
    description: 'مساحة آمنة لمناقشة التحديات النفسية والضغوط اليومية. جلسات دعم جماعي مع متخصصين في الصحة النفسية.',
    category: 'support-mental-health',
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
    memberCount: 38,
    visibility: 'public',
    admins: ['admin-3'],
    moderators: ['mod-4'],
    rules: [
      'السرية التامة',
      'الاحترام والدعم غير المشروط',
      'عدم الحكم على الآخرين',
      'المشاركة الطوعية',
    ],
    centerId: '2',
  },
  {
    id: 'support-4',
    name: 'نادي التأهيل المهني',
    description: 'مساعدة الشباب في العثور على فرص عمل مناسبة وتطوير المهارات المهنية. ورش عمل، تدريب، وإرشاد وظيفي.',
    category: 'support-vocational',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop',
    memberCount: 89,
    visibility: 'public',
    admins: ['admin-4'],
    moderators: ['mod-5', 'mod-6'],
    rules: [
      'الالتزام بالحضور',
      'المشاركة الفعالة في التدريبات',
      'مساعدة الآخرين في التطوير',
      'الاحترام المهني',
    ],
    centerId: '2',
  },
  {
    id: 'support-5',
    name: 'مجموعة دعم الناجين من العنف',
    description: 'مساحة آمنة للشباب الناجين من العنف. دعم نفسي، قانوني، واجتماعي مع محترفين متخصصين.',
    category: 'support-violence-survivors',
    coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=400&fit=crop',
    memberCount: 34,
    visibility: 'private',
    admins: ['admin-5'],
    moderators: ['mod-7'],
    rules: [
      'السرية الكاملة',
      'الاحترام والأمان للجميع',
      'عدم الكشف عن هوية الأعضاء',
      'الدعم غير المشروط',
    ],
    centerId: '3',
  },

  // Normal Clubs (أندية عامة)
  {
    id: 'club-1',
    name: 'نادي القراءة',
    description: 'نادي للقراء الشباب لمناقشة الكتب، مشاركة التوصيات، وتنظيم لقاءات شهرية. نقرأ الأدب العربي والعالمي والكتب العلمية.',
    category: 'culture-books',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
    memberCount: 127,
    visibility: 'public',
    admins: ['admin-6'],
    moderators: ['mod-8', 'mod-9'],
    rules: [
      'قراءة الكتاب المختار شهرياً',
      'المشاركة في المناقشات',
      'الاحترام للآراء المختلفة',
      'عدم الإساءة للكتب أو المؤلفين',
    ],
    centerId: '1',
  },
  {
    id: 'club-2',
    name: 'نادي الروبوتات والذكاء الاصطناعي',
    description: 'نادي تقني للشباب المهتمين بالروبوتات، البرمجة، والذكاء الاصطناعي. مشاريع، مسابقات، وورش عمل تقنية.',
    category: 'technology-robotics',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    memberCount: 156,
    visibility: 'public',
    admins: ['admin-7'],
    moderators: ['mod-10', 'mod-11'],
    rules: [
      'المشاركة في المشاريع',
      'التعلم المستمر',
      'مساعدة الأعضاء الجدد',
      'الاحترام الفني',
    ],
    centerId: '1',
  },
  {
    id: 'club-3',
    name: 'نادي الشباب والسياسة',
    description: 'منصة للحوار السياسي البناء والتوعية المدنية. مناقشات حول القضايا المحلية والوطنية، حقوق المواطن، والمشاركة السياسية.',
    category: 'politics-youth',
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop',
    memberCount: 94,
    visibility: 'public',
    admins: ['admin-8'],
    moderators: ['mod-12'],
    rules: [
      'الاحترام في النقاش',
      'الابتعاد عن التمييز',
      'التركيز على الحلول البناءة',
      'احترام وجهات النظر المختلفة',
    ],
    centerId: '2',
  },
  {
    id: 'club-4',
    name: 'نادي التصوير الفوتوغرافي',
    description: 'نادي للهواة والمحترفين في التصوير. جولات تصوير، ورش تعليمية، ومعارض فوتوغرافية.',
    category: 'arts-photography',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop',
    memberCount: 78,
    visibility: 'public',
    admins: ['admin-9'],
    moderators: ['mod-13'],
    rules: [
      'احترام خصوصية الآخرين',
      'المشاركة في الجولات',
      'تقاسم المعرفة',
      'احترام حقوق الصور',
    ],
    centerId: '3',
  },
  {
    id: 'club-5',
    name: 'نادي ريادة الأعمال',
    description: 'نادي للشباب رواد الأعمال. نقاش الأفكار، تطوير المشاريع، واستضافة رواد أعمال ناجحين.',
    category: 'entrepreneurship',
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
    memberCount: 143,
    visibility: 'public',
    admins: ['admin-10'],
    moderators: ['mod-14', 'mod-15'],
    rules: [
      'المشاركة الفعالة',
      'دعم الأفكار',
      'الشفافية',
      'التعلم المستمر',
    ],
    centerId: '1',
  },
  {
    id: 'club-6',
    name: 'نادي البيئة والاستدامة',
    description: 'نادي للشباب المهتمين بالبيئة والاستدامة. حملات تنظيف، مشاريع خضراء، وتوعية بيئية.',
    category: 'environment-sustainability',
    coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop',
    memberCount: 112,
    visibility: 'public',
    admins: ['admin-11'],
    moderators: ['mod-16'],
    rules: [
      'الالتزام بالممارسات البيئية',
      'المشاركة في الأنشطة',
      'التوعية البيئية',
      'احترام الطبيعة',
    ],
    centerId: '2',
  },
];

export const mockVolunteeringProjects: VolunteeringProject[] = [
  {
    id: 'green-algeria',
    title: 'الجزائر الخضراء',
    description: 'مشروع وطني لزراعة مليون شجرة في جميع أنحاء الجزائر. انضم إلينا في حملة التشجير الأكبر في تاريخ البلاد للمساهمة في مكافحة التغير المناخي وإنشاء غطاء أخضر مستدام.',
    category: 'environmental',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
    treesPlanted: 245000,
    totalTrees: 1000000,
    totalParticipants: 12500,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    organizer: 'وزارة البيئة والطاقات المتجددة',
    organizerContact: '+213555123456',
    wilaya: 'الجزائر',
    zones: [
      {
        id: 'zone-1',
        name: 'منطقة الشريط الساحلي',
        location: 'الجزائر، سيدي فرج',
        peopleNeeded: 150,
        peopleRegistered: 142,
        treesPlanted: 8500,
        status: 'open',
        coordinates: { lat: 36.7667, lng: 2.9167 },
        description: 'منطقة ساحلية تحتاج لزراعة أشجار مقاومة للملوحة',
      },
      {
        id: 'zone-2',
        name: 'منطقة الأطلس',
        location: 'البليدة، جبال الأطلس',
        peopleNeeded: 200,
        peopleRegistered: 198,
        treesPlanted: 12000,
        status: 'open',
        coordinates: { lat: 36.4730, lng: 2.8264 },
        description: 'منطقة جبلية تتطلب زراعة أشجار محلية مقاومة للجفاف',
      },
      {
        id: 'zone-3',
        name: 'منطقة الصحراء',
        location: 'الأغواط، الواحة الشمالية',
        peopleNeeded: 100,
        peopleRegistered: 95,
        treesPlanted: 6000,
        status: 'open',
        coordinates: { lat: 33.8014, lng: 2.8675 },
        description: 'منطقة صحراوية تحتاج لأشجار مقاومة للحرارة والعطش',
      },
      {
        id: 'zone-4',
        name: 'منطقة السهول',
        location: 'سطيف، السهول الداخلية',
        peopleNeeded: 180,
        peopleRegistered: 180,
        treesPlanted: 10500,
        status: 'full',
        coordinates: { lat: 36.1911, lng: 5.4137 },
        description: 'منطقة خصبة مناسبة لزراعة أنواع مختلفة من الأشجار',
      },
      {
        id: 'zone-5',
        name: 'منطقة الهضاب',
        location: 'باتنة، الهضاب العليا',
        peopleNeeded: 120,
        peopleRegistered: 118,
        treesPlanted: 7100,
        status: 'open',
        coordinates: { lat: 35.5569, lng: 6.1741 },
        description: 'منطقة مرتفعة تحتاج لزراعة أشجار متكيفة مع المناخ البارد',
      },
      {
        id: 'zone-6',
        name: 'منطقة الوادي',
        location: 'وهران، وادي الشلف',
        peopleNeeded: 140,
        peopleRegistered: 135,
        treesPlanted: 8100,
        status: 'open',
        coordinates: { lat: 35.6976, lng: -0.6337 },
        description: 'منطقة رطبة مناسبة لزراعة أشجار الفواكه والأشجار المثمرة',
      },
    ],
  },
  {
    id: 'clean-beach',
    title: 'حملة تنظيف الشواطئ',
    description: 'مبادرة لتنظيف الشواطئ الجزائرية من النفايات البلاستيكية',
    category: 'environmental',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    totalParticipants: 850,
    status: 'active',
    organizer: 'جمعية حماية البيئة',
    zones: [
      {
        id: 'beach-1',
        name: 'شاطئ الجزائر',
        location: 'الجزائر العاصمة',
        peopleNeeded: 50,
        peopleRegistered: 48,
        status: 'open',
      },
      {
        id: 'beach-2',
        name: 'شاطئ وهران',
        location: 'وهران',
        peopleNeeded: 40,
        peopleRegistered: 42,
        status: 'full',
      },
    ],
  },
  {
    id: 'literacy-campaign',
    title: 'حملة محو الأمية',
    description: 'مساعدة كبار السن في تعلم القراءة والكتابة',
    category: 'education',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    totalParticipants: 320,
    status: 'active',
    organizer: 'وزارة التربية الوطنية',
    zones: [
      {
        id: 'literacy-1',
        name: 'مركز الجزائر',
        location: 'دار الشباب المركزي',
        peopleNeeded: 25,
        peopleRegistered: 23,
        status: 'open',
      },
    ],
  },
  {
    id: 'blood-donation',
    title: 'يوم التبرع بالدم',
    description: 'حملة توعية وتبرع بالدم للمستشفيات',
    category: 'health',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
    totalParticipants: 450,
    status: 'upcoming',
    organizer: 'الصليب الأحمر الجزائري',
    zones: [
      {
        id: 'blood-1',
        name: 'وحدة التبرع المركزية',
        location: 'مستشفى مصطفى باشا',
        peopleNeeded: 100,
        peopleRegistered: 67,
        status: 'open',
      },
    ],
  },
  {
    id: 'elderly-support',
    title: 'دعم كبار السن',
    description: 'زيارة ومساعدة كبار السن في المنازل',
    category: 'social',
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
    totalParticipants: 280,
    status: 'active',
    organizer: 'جمعية التضامن الاجتماعي',
    zones: [
      {
        id: 'elderly-1',
        name: 'حي بئر مراد رايس',
        location: 'الجزائر',
        peopleNeeded: 30,
        peopleRegistered: 28,
        status: 'open',
      },
      {
        id: 'elderly-2',
        name: 'حي السانيا',
        location: 'وهران',
        peopleNeeded: 25,
        peopleRegistered: 22,
        status: 'open',
      },
    ],
  },
];