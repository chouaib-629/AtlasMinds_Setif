import React from 'react';
import { useApp } from '../lib/context';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Download, Share2 } from 'lucide-react';

interface QRTicketProps {
  qrCode: string;
  activityTitle: string;
  activityDate: string;
  activityTime: string;
  centerName: string;
  userName: string;
  onBack: () => void;
}

export function QRTicket({
  qrCode,
  activityTitle,
  activityDate,
  activityTime,
  centerName,
  userName,
  onBack,
}: QRTicketProps) {
  const { t, language } = useApp();
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-muted">
          <BackIcon className="w-6 h-6" />
        </button>
        <h2>{t('تذكرتك', 'Your Ticket')}</h2>
      </div>

      {/* Ticket */}
      <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
              <div className="text-4xl">✓</div>
            </div>
            <h2>{t('تم الحجز بنجاح!', 'Booking Confirmed!')}</h2>
            <p className="text-muted-foreground">
              {t('احتفظ بهذه التذكرة لمسحها عند الدخول', 'Keep this ticket to scan at entry')}
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl overflow-hidden">
            {/* Top Section */}
            <div className="p-6 space-y-4">
              <h3>{activityTitle}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm opacity-90">
                  <span>{t('التاريخ', 'Date')}</span>
                  <span>{activityDate}</span>
                </div>
                <div className="flex justify-between text-sm opacity-90">
                  <span>{t('الوقت', 'Time')}</span>
                  <span>{activityTime}</span>
                </div>
                <div className="flex justify-between text-sm opacity-90">
                  <span>{t('المركز', 'Center')}</span>
                  <span>{centerName}</span>
                </div>
                <div className="flex justify-between text-sm opacity-90">
                  <span>{t('الاسم', 'Name')}</span>
                  <span>{userName}</span>
                </div>
              </div>
            </div>

            {/* Perforation */}
            <div className="relative h-8">
              <div className="absolute inset-0 flex justify-between">
                <div className="w-8 h-8 -ml-4 rounded-full bg-background" />
                <div className="flex-1 border-t-2 border-dashed border-white/30 mt-4" />
                <div className="w-8 h-8 -mr-4 rounded-full bg-background" />
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-6 text-center">
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1 p-2">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 ${
                          Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-sm opacity-90 mb-2">{t('رمز الحجز', 'Booking Code')}</p>
              <p className="text-xs font-mono bg-white/20 inline-block px-4 py-2 rounded-lg">
                {qrCode}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Download className="w-5 h-5 ml-2" />
              {t('تحميل', 'Download')}
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="w-5 h-5 ml-2" />
              {t('مشاركة', 'Share')}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('سيتم مسح هذا الرمز عند الدخول للتحقق من حجزك', 
                 'This code will be scanned at entry to verify your booking')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
