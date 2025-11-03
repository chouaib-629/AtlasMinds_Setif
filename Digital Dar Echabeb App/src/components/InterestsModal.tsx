import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { useApp } from '../lib/context';
import { useAuth } from '../lib/authContext';
import { Button } from './ui/button';
import { Check, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface InterestsModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const interests = [
  { id: 'sports', labelAr: 'رياضة', labelEn: 'Sports', labelFr: 'Sport', icon: '⚽', color: 'bg-blue-500' },
  { id: 'learning', labelAr: 'تعلم', labelEn: 'Learning', labelFr: 'Apprentissage', icon: '📚', color: 'bg-green-500' },
  { id: 'social', labelAr: 'اجتماعي', labelEn: 'Social', labelFr: 'Social', icon: '🤝', color: 'bg-purple-500' },
  { id: 'environmental', labelAr: 'بيئة', labelEn: 'Environment', labelFr: 'Environnement', icon: '🌱', color: 'bg-emerald-500' },
  { id: 'e-sport', labelAr: 'رياضة إلكترونية', labelEn: 'E-Sports', labelFr: 'E-Sports', icon: '🎮', color: 'bg-red-500' },
  { id: 'arts', labelAr: 'فنون', labelEn: 'Arts', labelFr: 'Arts', icon: '🎨', color: 'bg-pink-500' },
  { id: 'music', labelAr: 'موسيقى', labelEn: 'Music', labelFr: 'Musique', icon: '🎵', color: 'bg-indigo-500' },
  { id: 'technology', labelAr: 'تكنولوجيا', labelEn: 'Technology', labelFr: 'Technologie', icon: '💻', color: 'bg-cyan-500' },
  { id: 'entrepreneurship', labelAr: 'ريادة أعمال', labelEn: 'Entrepreneurship', labelFr: 'Entrepreneuriat', icon: '💼', color: 'bg-orange-500' },
  { id: 'photography', labelAr: 'تصوير', labelEn: 'Photography', labelFr: 'Photographie', icon: '📷', color: 'bg-yellow-500' },
  { id: 'cooking', labelAr: 'طبخ', labelEn: 'Cooking', labelFr: 'Cuisine', icon: '🍳', color: 'bg-amber-500' },
  { id: 'volunteering', labelAr: 'تطوع', labelEn: 'Volunteering', labelFr: 'Bénévolat', icon: '🙌', color: 'bg-teal-500' },
];

export function InterestsModal({ open, onClose, onComplete }: InterestsModalProps) {
  const { t, language } = useApp();
  const { updatePreferences } = useAuth();
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      toast.error(t('الرجاء اختيار 3 اهتمامات على الأقل', 'Please select at least 3 interests', 'Veuillez sélectionner au moins 3 intérêts'));
      return;
    }

    setIsSaving(true);
    try {
      await updatePreferences({ preferences: selectedInterests });
      toast.success(t('تم حفظ الاهتمامات بنجاح', 'Interests saved successfully', 'Intérêts enregistrés avec succès'));
      onComplete();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('فشل حفظ الاهتمامات', 'Failed to save interests', 'Échec de l\'enregistrement des intérêts'));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset selected interests when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedInterests([]);
      setIsSaving(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="fixed bottom-0 left-4 right-4 mb-6 top-auto z-50 max-h-[90vh] overflow-hidden w-[calc(100%-2rem)] max-w-none translate-x-0 translate-y-0 rounded-3xl p-0 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:max-w-lg sm:left-[50%] sm:right-auto sm:translate-x-[-50%] sm:border-b"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex h-full max-h-[90vh] flex-col overflow-hidden">
          {/* Header with drag handle */}
          <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-6 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {t('اختر اهتماماتك', 'Select Your Interests', 'Choisissez vos intérêts')}
                </h2>
                <p className="text-sm opacity-90 mt-2">
                  {t(
                    'اختر 3 اهتمامات على الأقل للحصول على توصيات مخصصة',
                    'Select at least 3 interests to get personalized recommendations',
                    'Sélectionnez au moins 3 intérêts pour obtenir des recommendations personnalisées'
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={onClose}
              >
                <X className="h-100 w-100" />
              </Button>
            </div>
            
            {/* Drag handle */}
            <div className="mx-auto w-12 h-1.5 bg-primary-foreground/30 rounded-full" />
          </div>

          {/* Progress indicator */}
          <div className="bg-card px-6 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t('المحدد', 'Selected', 'Sélectionné')}: {selectedInterests.length}
              </span>
              <span className={selectedInterests.length >= 3 ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                {t('الحد الأدنى: 3', 'Minimum: 3', 'Minimum: 3')}
              </span>
            </div>
          </div>

          {/* Interests Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {interests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                const label = language === 'ar' ? interest.labelAr : language === 'en' ? interest.labelEn : interest.labelFr;
                
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`relative pt-6 pb-6 p-2 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg scale-105'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className="text-5xl mb-3">
                      {interest.icon}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <p className={`font-medium transition-colors ${
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="sticky bg-card p-6 pt-2">
            <Button
              onClick={handleContinue}
              disabled={selectedInterests.length < 3 || isSaving}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 " />
                  {t('جاري الحفظ...', 'Saving...', 'Enregistrement...')}
                </>
              ) : (
                t('متابعة', 'Continue', 'Continuer')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

