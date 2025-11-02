import React from 'react';
import { useApp } from '../lib/context';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LanguageSwitcherProps {
  variant?: 'full' | 'compact';
}

export function LanguageSwitcher({ variant = 'full' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useApp();

  const languages = [
    { code: 'ar' as const, label: 'العربية', labelEn: 'Arabic' },
    { code: 'en' as const, label: 'English', labelEn: 'English' },
    { code: 'fr' as const, label: 'Français', labelEn: 'French' },
  ];

  const currentLanguage = languages.find((l) => l.code === language);

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-11 w-11">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="gap-2"
            >
              <span className={language === lang.code ? 'opacity-100' : 'opacity-50'}>
                {lang.label}
              </span>
              {language === lang.code && (
                <span className="mr-auto text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-4 py-2">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {language === 'ar' ? 'اللغة' : language === 'fr' ? 'Langue' : 'Language'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage(lang.code)}
            className="h-11"
          >
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
