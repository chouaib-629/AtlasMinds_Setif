import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InterestsSelectionScreenProps {
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

export function InterestsSelectionScreen({ onComplete }: InterestsSelectionScreenProps) {
  const { t, language } = useApp();
  const { updatePreferences } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl">
            {t('اختر اهتماماتك', 'Select Your Interests', 'Choisissez vos intérêts')}
          </h1>
          <p className="text-sm opacity-90">
            {t(
              'اختر 3 اهتمامات على الأقل للحصول على توصيات مخصصة',
              'Select at least 3 interests to get personalized recommendations',
              'Sélectionnez au moins 3 intérêts pour obtenir des recommendations personnalisées'
            )}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('المحدد', 'Selected', 'Sélectionné')}: {selectedInterests.length}
          </span>
          <span className={selectedInterests.length >= 3 ? 'text-primary' : 'text-muted-foreground'}>
            {t('الحد الأدنى: 3', 'Minimum: 3', 'Minimum: 3')}
          </span>
        </div>
      </div>

      {/* Interests Grid */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            const label = language === 'ar' ? interest.labelAr : language === 'en' ? interest.labelEn : interest.labelFr;
            
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
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
                <div className="text-5xl mb-3">{interest.icon}</div>

                {/* Label */}
                <div className="text-center">
                  <p className={isSelected ? 'text-foreground' : 'text-muted-foreground'}>
                    {label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selectedInterests.length < 3 || isSaving}
            className="w-full h-12"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 " />
                {t('جاري الحفظ...', 'Saving...', 'Enregistrement...')}
              </>
            ) : (
              t('متابعة', 'Continue', 'Continuer')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
