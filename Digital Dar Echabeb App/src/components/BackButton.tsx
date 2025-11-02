import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../lib/context';

interface BackButtonProps {
  onClick: () => void;
  variant?: 'default' | 'ghost' | 'icon';
  className?: string;
}

export function BackButton({ onClick, variant = 'ghost', className = '' }: BackButtonProps) {
  const { language } = useApp();
  const isRTL = language === 'ar';

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={`h-11 w-11 ${className}`}
      >
        {isRTL ? <ArrowRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      className={`h-11 w-11 ${className}`}
    >
      {isRTL ? <ArrowRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
    </Button>
  );
}

