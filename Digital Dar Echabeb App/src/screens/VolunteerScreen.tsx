import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { mockVolunteerAssignments } from '../lib/data';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Clock, MapPin, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function VolunteerScreen() {
  const { t } = useApp();
  const [totalHours] = useState(12);
  const [targetHours] = useState(20);

  const handleCheckIn = (assignmentId: string) => {
    toast.success(t('تم تسجيل الدخول', 'Checked in successfully'));
  };

  const handleCheckOut = (assignmentId: string) => {
    toast.success(t('تم تسجيل الخروج', 'Checked out successfully'));
  };

  const progressPercent = (totalHours / targetHours) * 100;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 space-y-4">
        <h2>{t('لوحة المتطوع', 'Volunteer Dashboard')}</h2>
        
        {/* Hours Progress */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span>{t('ساعات التطوع', 'Volunteer Hours')}</span>
            <span className="text-2xl">{totalHours}/{targetHours}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-sm opacity-90">
            {t('متبقي', 'Remaining')}: {targetHours - totalHours} {t('ساعة', 'hours')}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Upcoming Assignments */}
        <div className="space-y-3">
          <h3>{t('المهام القادمة', 'Upcoming Assignments')}</h3>
          
          {mockVolunteerAssignments
            .filter(a => a.status === 'upcoming')
            .map((assignment) => (
              <div key={assignment.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-2">{assignment.activityTitle}</h4>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{assignment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{assignment.time} ({assignment.hours} {t('ساعات', 'hours')})</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {t('قادم', 'Upcoming')}
                  </Badge>
                </div>

                <Button onClick={() => handleCheckIn(assignment.id)} className="w-full">
                  <CheckCircle className="w-5 h-5 ml-2" />
                  {t('تسجيل الدخول', 'Check In')}
                </Button>
              </div>
            ))}

          {mockVolunteerAssignments.filter(a => a.status === 'upcoming').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t('لا توجد مهام قادمة', 'No upcoming assignments')}</p>
            </div>
          )}
        </div>

        {/* Active Assignments */}
        <div className="space-y-3">
          <h3>{t('المهام النشطة', 'Active Assignments')}</h3>
          
          {mockVolunteerAssignments
            .filter(a => a.status === 'checked-in')
            .map((assignment) => (
              <div key={assignment.id} className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-2">{assignment.activityTitle}</h4>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{t('تم تسجيل الدخول في', 'Checked in at')} {assignment.checkInTime}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {t('نشط', 'Active')}
                  </Badge>
                </div>

                <Button onClick={() => handleCheckOut(assignment.id)} variant="outline" className="w-full">
                  {t('تسجيل الخروج', 'Check Out')}
                </Button>
              </div>
            ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-3xl mb-1">5</p>
            <p className="text-muted-foreground">{t('المهام المكتملة', 'Completed')}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-3xl mb-1">+150</p>
            <p className="text-muted-foreground">{t('نقاط مكتسبة', 'Points Earned')}</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-muted/50 rounded-xl p-4">
          <h4 className="mb-2">{t('لماذا التطوع؟', 'Why Volunteer?')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• {t('اكسب نقاط إضافية', 'Earn bonus points')}</li>
            <li>• {t('ساعد مجتمعك', 'Help your community')}</li>
            <li>• {t('اكتسب خبرات جديدة', 'Gain new experiences')}</li>
            <li>• {t('احصل على شهادة تطوع', 'Get volunteer certificate')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
