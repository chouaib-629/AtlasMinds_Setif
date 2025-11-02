import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockActivities } from '../lib/data';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Edit, Trash2, QrCode, Bell, Upload, Users, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLocalScreen() {
  const { t } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const handleCreateActivity = () => {
    setShowCreateModal(false);
    toast.success(t('تم إنشاء النشاط بنجاح', 'Activity created successfully'));
  };

  const handleScanQR = () => {
    setShowScanModal(false);
    toast.success(t('تم تسجيل الحضور', 'Attendance recorded'));
  };

  const stats = [
    { label: t('الأنشطة النشطة', 'Active Activities'), value: '12', icon: Calendar, color: 'text-blue-500' },
    { label: t('إجمالي المشاركين', 'Total Participants'), value: '248', icon: Users, color: 'text-green-500' },
    { label: t('معدل الحضور', 'Attendance Rate'), value: '87%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 space-y-4">
        <h2>{t('لوحة الإدارة المحلية', 'Local Admin Dashboard')}</h2>
        
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <Icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                <p className="text-xl mb-1">{stat.value}</p>
                <p className="text-xs opacity-90">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="activities">{t('الأنشطة', 'Activities')}</TabsTrigger>
          <TabsTrigger value="attendance">{t('الحضور', 'Attendance')}</TabsTrigger>
          <TabsTrigger value="resources">{t('الموارد', 'Resources')}</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setShowCreateModal(true)} className="w-full">
              <Plus className="w-5 h-5 ml-2" />
              {t('نشاط جديد', 'New Activity')}
            </Button>
            <Button variant="outline" className="w-full">
              <Bell className="w-5 h-5 ml-2" />
              {t('إشعار', 'Broadcast')}
            </Button>
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {mockActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.date} • {activity.time}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {t('المسجلون', 'Registered')}: {activity.registered}/{activity.capacity}
                      </span>
                      {activity.waitlist > 0 && (
                        <span className="text-warning">
                          {t('قائمة الانتظار', 'Waitlist')}: {activity.waitlist}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={activity.registered >= activity.capacity ? 'destructive' : 'default'}>
                    {activity.registered >= activity.capacity ? t('ممتلئ', 'Full') : t('متاح', 'Available')}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 ml-1" />
                    {t('تعديل', 'Edit')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Trash2 className="w-4 h-4 ml-1" />
                    {t('حذف', 'Delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="p-4 space-y-4">
          {/* QR Scanner */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center space-y-4">
            <QrCode className="w-16 h-16 mx-auto" />
            <h3>{t('مسح رمز QR', 'Scan QR Code')}</h3>
            <p className="opacity-90">
              {t('امسح تذكرة المشارك لتسجيل حضوره', 'Scan participant ticket to record attendance')}
            </p>
            <Button onClick={() => setShowScanModal(true)} variant="secondary" size="lg" className="w-full">
              {t('فتح الماسح', 'Open Scanner')}
            </Button>
          </div>

          {/* Recent Scans */}
          <div className="space-y-3">
            <h4>{t('عمليات المسح الأخيرة', 'Recent Scans')}</h4>
            {['أحمد محمد', 'فاطمة علي', 'محمد حسن'].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                <div>
                  <p>{name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Badge className="bg-success text-success-foreground">
                  {t('تم التسجيل', 'Checked In')}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="p-4 space-y-4">
          <Button className="w-full">
            <Upload className="w-5 h-5 ml-2" />
            {t('رفع ملف جديد', 'Upload New Resource')}
          </Button>

          <div className="space-y-3">
            {['دليل المشارك.pdf', 'جدول الأنشطة.xlsx', 'صور الفعالية.zip'].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                <p>{file}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    {t('عرض', 'View')}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Activity Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('نشاط جديد', 'New Activity')}</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateActivity(); }}>
            <div className="space-y-2">
              <label>{t('عنوان النشاط', 'Activity Title')}</label>
              <Input required />
            </div>

            <div className="space-y-2">
              <label>{t('الوصف', 'Description')}</label>
              <Textarea rows={4} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label>{t('التاريخ', 'Date')}</label>
                <Input type="date" required />
              </div>
              <div className="space-y-2">
                <label>{t('الوقت', 'Time')}</label>
                <Input type="time" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label>{t('السعة', 'Capacity')}</label>
                <Input type="number" required />
              </div>
              <div className="space-y-2">
                <label>{t('السعر', 'Price')}</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>

            <div className="space-y-2">
              <label>{t('الفئة', 'Category')}</label>
              <select className="w-full px-3 py-2 bg-input-background border border-input rounded-lg" required>
                <option value="">{t('اختر الفئة', 'Select category')}</option>
                <option value="sports">{t('رياضة', 'Sports')}</option>
                <option value="learning">{t('تعليم', 'Learning')}</option>
                <option value="social">{t('اجتماعي', 'Social')}</option>
                <option value="environmental">{t('بيئي', 'Environmental')}</option>
                <option value="e-sport">{t('رياضة إلكترونية', 'E-Sports')}</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button type="submit" className="flex-1">
                {t('إنشاء', 'Create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Scan Modal */}
      <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('مسح رمز QR', 'Scan QR Code')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-muted-foreground" />
            </div>

            <p className="text-center text-muted-foreground">
              {t('محاكاة مسح رمز QR', 'QR Scan Simulation')}
            </p>

            <Button onClick={handleScanQR} className="w-full" size="lg">
              {t('تأكيد الحضور', 'Confirm Attendance')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
