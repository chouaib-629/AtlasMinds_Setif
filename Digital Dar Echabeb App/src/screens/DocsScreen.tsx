import React from 'react';
import { useApp } from '../lib/context';

export function DocsScreen() {
  const { t } = useApp();

  return (
    <div className="p-6 space-y-8 pb-20">
      <h1>{t('توثيق التطبيق', 'App Documentation')}</h1>

      {/* User Flows */}
      <section className="space-y-4">
        <h2>{t('تدفقات المستخدم', 'User Flows')}</h2>

        {/* Registration & Booking Flow */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h3>{t('تدفق التسجيل والحجز', 'Registration & Booking Flow')}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">1</div>
              <p>{t('التأهيل (3 شاشات)', 'Onboarding (3 screens)')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">2</div>
              <p>{t('تسجيل الدخول / الاشتراك + OTP', 'Login / Signup + OTP')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">3</div>
              <p>{t('الصفحة الرئيسية → تصفح الأنشطة', 'Home → Browse Activities')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">4</div>
              <p>{t('تفاصيل النشاط → احجز الآن', 'Activity Details → Book Now')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">5</div>
              <p>{t('تأكيد الحجز', 'Booking Confirmation')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">6</div>
              <p>{t('الدفع (إذا كان مدفوعاً)', 'Payment (if paid)')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">7</div>
              <p>{t('تذكرة QR', 'QR Ticket')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">8</div>
              <p>{t('المسؤول يمسح QR عند الدخول', 'Admin scans QR at entry')}</p>
            </div>
          </div>
        </div>

        {/* Suggestion & Voting Flow */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h3>{t('تدفق الاقتراحات والتصويت', 'Suggestion & Voting Flow')}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">1</div>
              <p>{t('المستخدم ينقر على "اقتراح جديد"', 'User clicks "New Suggestion"')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">2</div>
              <p>{t('ملء النموذج (عنوان، وصف، فئة)', 'Fill form (title, description, category)')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">3</div>
              <p>{t('الاقتراح يظهر في القائمة بحالة "قيد المراجعة"', 'Suggestion appears in list as "Pending"')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">4</div>
              <p>{t('المستخدمون الآخرون يمكنهم التصويت (مرة واحدة لكل اقتراح)', 'Other users can vote (once per suggestion)')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">5</div>
              <p>{t('المسؤول يراجع ويوافق/يرفض', 'Admin reviews and approves/rejects')}</p>
            </div>
          </div>
        </div>

        {/* Admin Create Activity Flow */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h3>{t('تدفق المسؤول: إنشاء نشاط', 'Admin: Create Activity Flow')}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">1</div>
              <p>{t('المسؤول المحلي ينقر على "نشاط جديد"', 'Local Admin clicks "New Activity"')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">2</div>
              <p>{t('ملء التفاصيل (عنوان، وصف، تاريخ، وقت، سعة، سعر، فئة)', 'Fill details (title, description, date, time, capacity, price, category)')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">3</div>
              <p>{t('النشاط يظهر في التقويم والخريطة', 'Activity appears in Calendar and Map')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">4</div>
              <p>{t('المستخدمون يمكنهم الحجز', 'Users can book')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">5</div>
              <p>{t('المسؤول يمسح QR عند الدخول', 'Admin scans QR at entry')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Model (ERD) */}
      <section className="space-y-4">
        <h2>{t('نموذج البيانات (ERD)', 'Data Model (ERD)')}</h2>
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          {[
            {
              entity: 'User',
              fields: ['id', 'name', 'email', 'phone', 'wilaya', 'age', 'points', 'streak', 'level', 'badges[]'],
            },
            {
              entity: 'Center',
              fields: ['id', 'name', 'wilaya', 'address', 'lat', 'lng', 'capacity', 'rating'],
            },
            {
              entity: 'Activity',
              fields: ['id', 'title', 'description', 'centerId', 'category', 'type', 'price', 'date', 'time', 'capacity', 'registered', 'waitlist'],
            },
            {
              entity: 'Registration',
              fields: ['id', 'activityId', 'userId', 'status', 'qrCode', 'attendanceScanned', 'paymentStatus'],
            },
            {
              entity: 'Payment',
              fields: ['id', 'registrationId', 'amount', 'status', 'method', 'timestamp'],
            },
            {
              entity: 'Suggestion',
              fields: ['id', 'userId', 'title', 'description', 'category', 'wilaya', 'votes', 'votedBy[]', 'status', 'comments[]'],
            },
            {
              entity: 'Vote',
              fields: ['id', 'suggestionId', 'userId', 'timestamp'],
            },
            {
              entity: 'Quest',
              fields: ['id', 'title', 'description', 'type', 'progress', 'total', 'reward', 'completed'],
            },
            {
              entity: 'Badge',
              fields: ['id', 'name', 'description', 'tier', 'earned', 'earnedAt', 'fragments', 'totalFragments'],
            },
            {
              entity: 'Reward',
              fields: ['id', 'title', 'description', 'category', 'cost', 'available'],
            },
            {
              entity: 'VolunteerAssignment',
              fields: ['id', 'activityId', 'userId', 'date', 'time', 'hours', 'status', 'checkInTime', 'checkOutTime'],
            },
            {
              entity: 'Notification',
              fields: ['id', 'userId', 'type', 'title', 'message', 'read', 'createdAt', 'actionUrl'],
            },
          ].map((entity) => (
            <div key={entity.entity} className="bg-muted/50 rounded-lg p-3">
              <h4 className="mb-2">{entity.entity}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {entity.fields.map((field) => (
                  <div key={field} className="pl-4">• {field}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QA Checklist */}
      <section className="space-y-4">
        <h2>{t('قائمة التحقق من الجودة', 'QA Checklist')}</h2>
        <div className="bg-card rounded-xl border border-border p-4 space-y-2 text-sm">
          {[
            t('✓ دعم RTL للعربية', '✓ RTL support for Arabic'),
            t('✓ التبديل بين الوضع الفاتح/الداكن', '✓ Light/Dark mode toggle'),
            t('✓ التبديل بين العربية/الإنجليزية', '✓ Arabic/English toggle'),
            t('✓ تدفق التأهيل (3 شاشات + إذن الموقع)', '✓ Onboarding flow (3 screens + location permission)'),
            t('✓ المصادقة (تسجيل الدخول، التسجيل، OTP)', '✓ Authentication (Login, Signup, OTP)'),
            t('✓ الصفحة الرئيسية مع لافتة موضوع الأسبوع', '✓ Home with Theme of Week banner'),
            t('✓ الخريطة + عرض قائمة المراكز الأقرب', '✓ Map + Nearest centers list view'),
            t('✓ تفاصيل النشاط مع علامات التبويب (حول، الموارد، النقاش)', '✓ Activity details with tabs (About, Resources, Discussion)'),
            t('✓ تدفق الحجز → الدفع → تذكرة QR', '✓ Booking → Payment → QR ticket flow'),
            t('✓ القاعة الافتراضية مع الدردشة المباشرة + ردود الفعل + انخفاض المكافأة', '✓ Virtual Hall with live chat + reactions + reward drop'),
            t('✓ نظام الاقتراحات مع التصويت (مرة واحدة لكل مستخدم)', '✓ Suggestions system with upvoting (once per user)'),
            t('✓ المهام والسلم الأسبوعي (Rookie → Platinum)', '✓ Quests & Weekly Ladder (Rookie → Platinum)'),
            t('✓ شارات مع قطع الشارات وبطاقة Buddy Pass', '✓ Badges with fragments & Buddy Pass card'),
            t('✓ متجر المكافآت مع فئات', '✓ Rewards Store with categories'),
            t('✓ لوحة المتطوع مع تسجيل الدخول/الخروج', '✓ Volunteer dashboard with check-in/out'),
            t('✓ الإشعارات', '✓ Notifications'),
            t('✓ لوحة المسؤول المحلي (إنشاء/تعديل/حذف النشاط، مسح QR)', '✓ Admin Local dashboard (create/edit/delete activity, QR scan)'),
            t('✓ شبكة 8pt ونصف قطر متسقة', '✓ 8pt grid & consistent radius'),
            t('✓ أهداف اللمس ≥ 44px', '✓ Touch targets ≥ 44px'),
            t('✓ حالات المكونات (الافتراضي/التمرير/الضغط/المعطل)', '✓ Component states (default/hover/pressed/disabled)'),
            t('✓ رموز من lucide-react', '✓ Icons from lucide-react'),
            t('✓ تصميم متجاوب ومحسّن للأجهزة المحمولة', '✓ Responsive & mobile-optimized design'),
          ].map((item, i) => (
            <div key={i} className="py-1">{item}</div>
          ))}
        </div>
      </section>

      {/* Features Summary */}
      <section className="space-y-4">
        <h2>{t('ملخص الميزات', 'Features Summary')}</h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            { title: t('التأهيل والمصادقة', 'Onboarding & Auth'), desc: t('3 شاشات تأهيل + تسجيل دخول/اشتراك مع OTP', '3 onboarding screens + login/signup with OTP') },
            { title: t('الصفحة الرئيسية المخصصة', 'Personalized Home'), desc: t('موجز مع لافتة موضوع الأسبوع، فلاتر، أنشطة موصى بها', 'Feed with Theme of Week banner, filters, recommended activities') },
            { title: t('الخريطة والبحث', 'Map & Search'), desc: t('عرض الخريطة مع دبابيس، أقرب القائمة، فلاتر الفئة', 'Map view with pins, nearest list, category filters') },
            { title: t('تفاصيل النشاط', 'Activity Details'), desc: t('علامات تبويب حول/الموارد/النقاش، الحجز، الدفع، تذكرة QR', 'About/Resources/Discussion tabs, booking, payment, QR ticket') },
            { title: t('القاعة الافتراضية', 'Virtual Hall'), desc: t('البث المباشر، الدردشة، ردود الفعل، انخفاض المكافأة المؤقت', 'Live stream, chat, reactions, timed reward drop') },
            { title: t('الاقتراحات', 'Suggestions'), desc: t('إرسال، التصويت (مرة واحدة لكل مستخدم)، التعليقات، الاعتدال', 'Submit, upvote (once per user), comments, moderation') },
            { title: t('المهام والسلم', 'Quests & Ladder'), desc: t('يومي/أسبوعي/موسمي، السلم مع الأقسام، إعادة تعيين الاثنين، Buddy Pass', 'Daily/weekly/seasonal, ladder with divisions, Monday reset, Buddy Pass') },
            { title: t('الشارات والمكافآت', 'Badges & Rewards'), desc: t('قطع الشارات، Y-Pass، متجر المكافآت مع الفئات', 'Badge fragments, Y-Pass, rewards store with categories') },
            { title: t('التطوع', 'Volunteering'), desc: t('المهام، تتبع الساعات، تسجيل الدخول/الخروج', 'Assignments, hours tracking, check-in/out') },
            { title: t('الإدارة', 'Admin'), desc: t('المحلية: إنشاء/تعديل/حذف النشاط، مسح QR، الموارد، مؤشرات الأداء الرئيسية', 'Local: create/edit/delete activity, QR scan, resources, KPIs') },
            { title: t('الإشعارات', 'Notifications'), desc: t('التذكيرات، الإعلانات، الإنجازات، المكافآت', 'Reminders, announcements, achievements, rewards') },
            { title: t('الملف الشخصي', 'Profile'), desc: t('النقاط، السلسلة، الشارات، Y-Pass، إعدادات الوضع الفاتح/الداكن واللغة', 'Points, streak, badges, Y-Pass, light/dark & language settings') },
          ].map((feature, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4">
              <h4 className="mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Stack */}
      <section className="space-y-4">
        <h2>{t('المجموعة التقنية', 'Technical Stack')}</h2>
        <div className="bg-card rounded-xl border border-border p-4 space-y-2 text-sm">
          <p>• <strong>React</strong> {t('مع TypeScript', 'with TypeScript')}</p>
          <p>• <strong>Tailwind CSS</strong> {t('للتصميم', 'for styling')}</p>
          <p>• <strong>Shadcn/ui</strong> {t('مكونات واجهة المستخدم', 'UI components')}</p>
          <p>• <strong>Lucide React</strong> {t('للرموز', 'for icons')}</p>
          <p>• <strong>Sonner</strong> {t('للإخطارات المنبثقة', 'for toast notifications')}</p>
          <p>• <strong>RTL Support</strong> {t('دعم كامل للعربية', 'full Arabic support')}</p>
          <p>• <strong>Dark Mode</strong> {t('مع متغيرات CSS', 'with CSS variables')}</p>
        </div>
      </section>
    </div>
  );
}
