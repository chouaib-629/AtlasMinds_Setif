import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { ArrowRight, Upload, Users, Lock, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { ScrollArea } from '../components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

interface CreateClubScreenProps {
  onBack: () => void;
  onComplete: (clubId: string) => void;
}

export function CreateClubScreen({ onBack, onComplete }: CreateClubScreenProps) {
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    visibility: 'public',
    coverImage: '',
    rules: '',
  });

  const categories = [
    { value: 'sports', label: t('رياضة', 'Sports', 'Sports') },
    { value: 'tech', label: t('تقنية', 'Technology', 'Technologie') },
    { value: 'arts', label: t('فنون', 'Arts', 'Arts') },
    { value: 'music', label: t('موسيقى', 'Music', 'Musique') },
    { value: 'education', label: t('تعليم', 'Education', 'Éducation') },
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error(t('الرجاء إدخال اسم النادي', 'Please enter club name', 'Entrez le nom du club'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.category) {
        toast.error(t('الرجاء اختيار فئة', 'Please select category', 'Sélectionnez une catégorie'));
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleCreateClub();
    }
  };

  const handleCreateClub = () => {
    toast.success(t('تم إنشاء النادي بنجاح!', 'Club created successfully!', 'Club créé avec succès!'));
    onComplete('new-club-1');
  };

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
              <h1>{t('إنشاء نادي جديد', 'Create New Club', 'Créer un club')}</h1>
              <p className="text-xs text-muted-foreground">
                {t('الخطوة', 'Step', 'Étape')} {step} {t('من', 'of', 'sur')} 3
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card px-4 pb-4">
        <div className="flex gap-2">
          <div className={`h-1 flex-1 rounded ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1 flex-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-1 flex-1 rounded ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{t('اسم النادي', 'Club Name', 'Nom du club')}</Label>
                <Input
                  id="name"
                  placeholder={t('مثال: نادي البرمجة', 'e.g., Programming Club', 'ex: Club de Programmation')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('الوصف', 'Description', 'Description')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('اكتب وصفاً موجزاً عن النادي...', 'Write a brief description...', 'Écrivez une description...')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('صورة الغلاف', 'Cover Image', 'Image de couverture')}</Label>
                <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t('اضغط لرفع صورة', 'Click to upload', 'Cliquez pour télécharger')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="category">{t('الفئة', 'Category', 'Catégorie')}</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('اختر فئة', 'Select category', 'Sélectionnez une catégorie')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>{t('الخصوصية', 'Visibility', 'Visibilité')}</Label>
                <RadioGroup value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                  <div className="flex items-start space-x-2 space-x-reverse rounded-lg border border-border p-4">
                    <RadioGroupItem value="public" id="public" />
                    <div className="flex-1">
                      <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                        <Globe className="h-5 w-5" />
                        {t('عام', 'Public', 'Public')}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('يمكن لأي شخص الانضمام', 'Anyone can join', 'Tout le monde peut rejoindre')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 space-x-reverse rounded-lg border border-border p-4">
                    <RadioGroupItem value="private" id="private" />
                    <div className="flex-1">
                      <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                        <Lock className="h-5 w-5" />
                        {t('خاص', 'Private', 'Privé')}
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('يتطلب دعوة أو موافقة', 'Requires invitation or approval', 'Nécessite une invitation')}
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="rules">{t('قواعد النادي', 'Club Rules', 'Règles du club')}</Label>
                <Textarea
                  id="rules"
                  placeholder={t('اكتب قواعد النادي (اختياري)...', 'Write club rules (optional)...', 'Règles (optionnel)...')}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  {t('يمكنك إضافة قاعدة في كل سطر', 'Add one rule per line', 'Une règle par ligne')}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h3 className="mb-3">{t('ملخص النادي', 'Club Summary', 'Résumé du club')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('الاسم:', 'Name:', 'Nom:')}</span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('الفئة:', 'Category:', 'Catégorie:')}</span>
                    <span>{categories.find((c) => c.value === formData.category)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('الخصوصية:', 'Visibility:', 'Visibilité:')}</span>
                    <span>{formData.visibility === 'public' ? t('عام', 'Public', 'Public') : t('خاص', 'Private', 'Privé')}</span>
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
            {step === 3 ? t('إنشاء النادي', 'Create Club', 'Créer') : t('التالي', 'Next', 'Suivant')}
          </Button>
        </div>
      </div>
    </div>
  );
}
