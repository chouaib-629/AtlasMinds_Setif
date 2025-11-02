import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Button } from '../components/ui/button';
import { ChevronRight, ChevronLeft, MapPin, Sparkles, Users } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t, language } = useApp();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Users,
      title: t('مرحباً بك في دار الشباب الرقمية', 'Welcome to Digital Youth Center'),
      description: t(
        'اكتشف الأنشطة والفعاليات الشبابية في منطقتك وشارك في بناء مجتمعك',
        'Discover youth activities and events in your area and participate in building your community'
      ),
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      icon: MapPin,
      title: t('اعثر على أقرب مركز', 'Find Nearest Center'),
      description: t(
        'تصفح خريطة دور الشباب واحجز مكانك في الأنشطة الرياضية والتعليمية',
        'Browse youth centers map and book your spot in sports and educational activities'
      ),
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: Sparkles,
      title: t('اكسب النقاط والمكافآت', 'Earn Points & Rewards'),
      description: t(
        'احصل على نقاط عند المشاركة واستبدلها بمكافآت حصرية وأولوية الحجز',
        'Earn points for participation and redeem them for exclusive rewards and priority booking'
      ),
      gradient: 'from-orange-500 to-pink-600',
    },
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const NextIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className={`flex-1 bg-gradient-to-br ${currentSlide.gradient} flex items-center justify-center p-8 relative overflow-hidden`}>
        {/* Algerian Flag Motif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-green-600" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 rounded-full bg-red-600" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600">
                <svg viewBox="0 0 24 24" className="w-full h-full text-white">
                  <path
                    fill="currentColor"
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Youth Illustration */}
        <div className="relative z-10">
          <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon className="w-32 h-32 text-white" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-background p-8 space-y-6">
        <div className="text-center space-y-3">
          <h1>{currentSlide.title}</h1>
          <p className="text-muted-foreground">{currentSlide.description}</p>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setStep(index)}
              className={`h-2 rounded-full transition-all cursor-pointer hover:opacity-70 ${
                index === step
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step < slides.length - 1 ? (
            <>
              <Button variant="outline" size="lg" onClick={handleSkip} className="flex-1">
                {t('تخطي', 'Skip')}
              </Button>
              <Button size="lg" onClick={handleNext} className="flex-1">
                {t('التالي', 'Next')}
                <NextIcon className="w-5 h-5 mr-2" />
              </Button>
            </>
          ) : (
            <Button size="lg" onClick={handleNext} className="w-full">
              {t('ابدأ الآن', 'Get Started')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
