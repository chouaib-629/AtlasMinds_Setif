import React, { useState } from 'react';
import { useApp } from '../lib/context';
import {
  BarChart3,
  FileText,
  Database,
  Download,
  Filter,
  Search,
  Shield,
  Lock,
  Clock,
  ArrowRight,
  TrendingUp,
  Users,
  Calendar,
  Award,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface CentralAdminScreenProps {
  onBack: () => void;
}

export function CentralAdminScreen({ onBack }: CentralAdminScreenProps) {
  const { t } = useApp();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header with Security Badge */}
      <div className="border-b border-destructive/20 bg-card">
        <div className="flex items-center justify-between bg-destructive/10 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <Shield className="h-4 w-4" />
            <span>{t('منطقة آمنة - الإدارة المركزية', 'Secure Area - Central Admin', 'Zone sécurisée - Admin central')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{t('آخر دخول: اليوم 09:30', 'Last login: Today 09:30', 'Dernière connexion: Aujourd\'hui 09:30')}</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-11 w-11">
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-destructive" />
              <h1>{t('الإدارة المركزية', 'Central Administration', 'Administration Centrale')}</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Lock className="h-4 w-4" />
            {t('2FA', '2FA', '2FA')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-1 flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none">
          <TabsTrigger value="dashboard">
            <BarChart3 className="ml-2 h-4 w-4" />
            {t('لوحة المعلومات', 'Dashboard', 'Tableau de bord')}
          </TabsTrigger>
          <TabsTrigger value="correspondence">
            <FileText className="ml-2 h-4 w-4" />
            {t('المراسلات', 'Correspondence', 'Correspondance')}
          </TabsTrigger>
          <TabsTrigger value="data-room">
            <Database className="ml-2 h-4 w-4" />
            {t('غرفة البيانات', 'Data Room', 'Salle de données')}
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="dashboard" className="m-0 p-4">
            <DashboardTab
              selectedWilaya={selectedWilaya}
              setSelectedWilaya={setSelectedWilaya}
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
            />
          </TabsContent>

          <TabsContent value="correspondence" className="m-0 p-4">
            <CorrespondenceTab />
          </TabsContent>

          <TabsContent value="data-room" className="m-0 p-4">
            <DataRoomTab />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function DashboardTab({
  selectedWilaya,
  setSelectedWilaya,
  selectedTimeframe,
  setSelectedTimeframe,
}: {
  selectedWilaya: string;
  setSelectedWilaya: (value: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
}) {
  const { t } = useApp();

  const wilayas = [
    { value: 'all', label: t('كل الولايات', 'All Wilayas', 'Toutes les wilayas') },
    { value: 'algiers', label: t('الجزائر', 'Algiers', 'Alger') },
    { value: 'oran', label: t('وهران', 'Oran', 'Oran') },
    { value: 'constantine', label: t('قسنطينة', 'Constantine', 'Constantine') },
  ];

  const timeframes = [
    { value: 'week', label: t('أسبوع', 'Week', 'Semaine') },
    { value: 'month', label: t('شهر', 'Month', 'Mois') },
    { value: 'quarter', label: t('ربع سنة', 'Quarter', 'Trimestre') },
    { value: 'year', label: t('سنة', 'Year', 'Année') },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {wilayas.map((w) => (
              <SelectItem key={w.value} value={w.value}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              {t('إجمالي المشاركين', 'Total Participants', 'Participants totaux')}
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl">12,458</span>
              <div className="flex items-center gap-1 text-sm text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              {t('الأنشطة', 'Activities', 'Activités')}
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl">348</span>
              <div className="flex items-center gap-1 text-sm text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              {t('الحضور', 'Attendance', 'Présence')}
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl">87%</span>
              <div className="flex items-center gap-1 text-sm text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              {t('المراكز النشطة', 'Active Centers', 'Centres actifs')}
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl">24</span>
              <span className="text-sm text-muted-foreground">/ 28</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Activities */}
      <Card>
        <CardHeader>
          <CardTitle>{t('الأنشطة الأكثر شعبية', 'Top Activities', 'Activités populaires')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'ورشة البرمجة', participants: 234, center: 'دار الشباب المركزي' },
              { name: 'بطولة كرة القدم', participants: 198, center: 'دار الشباب الرياضي' },
              { name: 'حفل موسيقي', participants: 176, center: 'دار الشباب الثقافي' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="text-sm">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.center}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm">{activity.participants}</p>
                  <p className="text-xs text-muted-foreground">{t('مشارك', 'participants', 'participants')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <Button className="w-full gap-2">
        <Download className="h-5 w-5" />
        {t('تصدير التقرير (PDF)', 'Export Report (PDF)', 'Exporter (PDF)')}
      </Button>
    </div>
  );
}

function CorrespondenceTab() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const correspondence = [
    { id: '1', type: 'received', from: 'ولاية الجزائر', subject: 'طلب تقرير شهري', date: '2025-11-01', status: 'in-review' },
    { id: '2', type: 'sent', to: 'وزارة الشباب', subject: 'تقرير الربع الثالث', date: '2025-10-28', status: 'approved' },
    { id: '3', type: 'received', from: 'ولاية وهران', subject: 'استفسار عن ميزانية', date: '2025-10-25', status: 'archived' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      'received': { variant: 'secondary', label: t('مستلم', 'Received', 'Reçu') },
      'in-review': { variant: 'default', label: t('قيد المراجعة', 'In Review', 'En révision') },
      'approved': { variant: 'outline', label: t('معتمد', 'Approved', 'Approuvé') },
      'archived': { variant: 'secondary', label: t('مؤرشف', 'Archived', 'Archivé') },
    };
    const config = variants[status] || variants.received;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('بحث في المراسلات...', 'Search correspondence...', 'Rechercher...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('النوع', 'Type', 'Type')}</TableHead>
              <TableHead>{t('من/إلى', 'From/To', 'De/À')}</TableHead>
              <TableHead>{t('الموضوع', 'Subject', 'Sujet')}</TableHead>
              <TableHead>{t('التاريخ', 'Date', 'Date')}</TableHead>
              <TableHead>{t('الحالة', 'Status', 'Statut')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {correspondence.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge variant={item.type === 'received' ? 'secondary' : 'outline'}>
                    {item.type === 'received' ? t('وارد', 'In', 'Entrant') : t('صادر', 'Out', 'Sortant')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{item.type === 'received' ? item.from : item.to}</TableCell>
                <TableCell className="text-sm">{item.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button className="w-full gap-2">
        <Download className="h-5 w-5" />
        {t('تصدير سجل المراسلات (CSV)', 'Export Log (CSV)', 'Exporter (CSV)')}
      </Button>
    </div>
  );
}

function DataRoomTab() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const datasets = [
    { id: '1', name: 'قاعدة بيانات المشاركين 2025', category: 'participants', size: '12 MB', access: 'admin-only' },
    { id: '2', name: 'تقارير الأنشطة الشهرية', category: 'reports', size: '8 MB', access: 'restricted' },
    { id: '3', name: 'ميزانيات المراكز', category: 'finance', size: '4 MB', access: 'admin-only' },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
        <div className="flex items-start gap-2">
          <Lock className="h-5 w-5 shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="mb-1 text-destructive">
              {t('منطقة آمنة', 'Secure Area', 'Zone sécurisée')}
            </p>
            <p className="text-muted-foreground">
              {t('جميع التنزيلات مسجلة ومراقبة', 'All downloads are logged and monitored', 'Tous les téléchargements sont surveillés')}
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('بحث في البيانات...', 'Search datasets...', 'Rechercher...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="space-y-3">
        {datasets.map((dataset) => (
          <div key={dataset.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-sm">{dataset.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{dataset.size}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="h-5 px-2 text-xs">
                    {dataset.access === 'admin-only' ? t('مدراء فقط', 'Admin Only', 'Admins uniquement') : t('محدود', 'Restricted', 'Restreint')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Download className="h-4 w-4" />
              {t('تحميل', 'Download', 'Télécharger')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
