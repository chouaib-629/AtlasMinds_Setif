import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { ArrowRight, Calendar as CalendarIcon, Clock, Video, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { Calendar } from '../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner@2.0.3';

interface AppointmentBookingScreenProps {
  centerId: string;
  centerName: string;
  onBack: () => void;
  onComplete: (appointmentId: string) => void;
}

const REPRESENTATIVES = [
  { id: '1', name: 'أحمد بن علي', role: 'مدير المركز', available: true },
  { id: '2', name: 'فاطمة محمود', role: 'منسقة الأنشطة', available: true },
  { id: '3', name: 'كريم العربي', role: 'مسؤول التسجيل', available: false },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export function AppointmentBookingScreen({
  centerId,
  centerName,
  onBack,
  onComplete,
}: AppointmentBookingScreenProps) {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [selectedRep, setSelectedRep] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleNext = () => {
    if (step === 1 && !selectedRep) {
      toast.error(t('الرجاء اختيار ممثل', 'Please select a representative', 'Sélectionnez un représentant'));
      return;
    }
    if (step === 2 && !selectedDate) {
      toast.error(t('الرجاء اختيار تاريخ', 'Please select a date', 'Sélectionnez une date'));
      return;
    }
    if (step === 2 && !selectedTime) {
      toast.error(t('الرجاء اختيار وقت', 'Please select a time', 'Sélectionnez une heure'));
      return;
    }
    if (step === 3 && !purpose.trim()) {
      toast.error(t('الرجاء إدخال سبب الموعد', 'Please enter purpose', 'Entrez le motif'));
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    const appointmentId = 'apt-' + Date.now();
    toast.success(t('تم حجز الموعد بنجاح!', 'Appointment booked!', 'Rendez-vous réservé!'));
    onComplete(appointmentId);
  };

  const selectedRepData = REPRESENTATIVES.find((r) => r.id === selectedRep);

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
              <h1>{t('حجز موعد عن بعد', 'Book Remote Appointment', 'Rendez-vous à distance')}</h1>
              <p className="text-xs text-muted-foreground">{centerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card px-4 pb-4">
        <div className="flex gap-2">
          <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1 flex-1 rounded ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {step === 1 && (
            <>
              <div className="mb-4">
                <h2 className="mb-2">{t('اختر الممثل', 'Choose Representative', 'Choisir un représentant')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('اختر الشخص الذي تريد مقابلته', 'Select who you want to meet', 'Sélectionnez la personne')}
                </p>
              </div>
              <div className="space-y-3">
                {REPRESENTATIVES.map((rep) => (
                  <div
                    key={rep.id}
                    onClick={() => rep.available && setSelectedRep(rep.id)}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedRep === rep.id
                        ? 'border-primary bg-primary/5'
                        : rep.available
                        ? 'border-border hover:border-primary/50'
                        : 'border-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3>{rep.name}</h3>
                        <p className="text-sm text-muted-foreground">{rep.role}</p>
                      </div>
                      {rep.available ? (
                        <div className="flex items-center gap-1 text-sm text-accent">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                          {t('متاح', 'Available', 'Disponible')}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {t('غير متاح', 'Unavailable', 'Indisponible')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <h2 className="mb-2">{t('اختر التاريخ والوقت', 'Choose Date & Time', 'Choisir date et heure')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('حدد موعداً مناسباً لك', 'Select a convenient time', 'Sélectionnez un créneau')}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 5}
                  className="rounded-md"
                />
              </div>

              {selectedDate && (
                <>
                  <Label>{t('اختر الوقت', 'Select Time', 'Sélectionner l\'heure')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="h-11"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-4">
                <h2 className="mb-2">{t('تأكيد الموعد', 'Confirm Appointment', 'Confirmer le rendez-vous')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('راجع التفاصيل قبل التأكيد', 'Review details before confirming', 'Vérifier les détails')}
                </p>
              </div>

              <div className="space-y-4 rounded-lg border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{selectedRepData?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRepData?.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{selectedDate?.toLocaleDateString('ar-DZ')}</span>
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{selectedTime}</span>
                  <span className="text-sm text-muted-foreground">
                    (30 {t('دقيقة', 'minutes', 'minutes')})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">
                  {t('سبب الموعد', 'Purpose of Meeting', 'Motif du rendez-vous')}
                </Label>
                <Textarea
                  id="purpose"
                  placeholder={t('اكتب سبب الموعد...', 'Describe the purpose...', 'Décrivez le motif...')}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="rounded-lg bg-accent/10 p-4">
                <div className="flex items-start gap-2">
                  <Video className="h-5 w-5 shrink-0 text-accent" />
                  <div className="text-sm">
                    <p className="mb-1">
                      {t('سيتم إرسال رابط الاجتماع', 'Meeting link will be sent', 'Le lien sera envoyé')}
                    </p>
                    <p className="text-muted-foreground">
                      {t('ستتلقى إشعاراً برابط الاجتماع قبل الموعد', 'You will receive a notification with the meeting link', 'Vous recevrez une notification')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              {t('السابق', 'Previous', 'Précédent')}
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {step === 3 ? t('تأكيد الحجز', 'Confirm Booking', 'Confirmer') : t('التالي', 'Next', 'Suivant')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Appointment Confirmation Screen
export function AppointmentConfirmationScreen({ appointmentId, onBack }: { appointmentId: string; onBack: () => void }) {
  const { t } = useApp();
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-accent/20 p-6">
              <CheckCircle2 className="h-16 w-16 text-accent" />
            </div>
          </div>
          <div>
            <h1 className="mb-2">{t('تم تأكيد الموعد!', 'Appointment Confirmed!', 'Rendez-vous confirmé!')}</h1>
            <p className="text-muted-foreground">
              {t('تم حجز موعدك بنجاح', 'Your appointment has been booked', 'Votre rendez-vous est réservé')}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-right">
            <p className="mb-2 text-sm text-muted-foreground">
              {t('رقم الموعد', 'Appointment ID', 'ID du rendez-vous')}
            </p>
            <p className="font-mono text-lg">{appointmentId}</p>
          </div>
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="text-muted-foreground">
              {t('سيتم إرسال رابط الاجتماع عبر الإشعارات قبل 15 دقيقة من الموعد', 'Meeting link will be sent 15 minutes before', 'Le lien sera envoyé 15 minutes avant')}
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={onBack} className="w-full">
              {t('العودة للرئيسية', 'Back to Home', 'Retour')}
            </Button>
            <Button variant="outline" className="w-full">
              {t('إضافة للتقويم', 'Add to Calendar', 'Ajouter au calendrier')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
