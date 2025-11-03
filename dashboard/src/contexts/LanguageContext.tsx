'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/lib/api';
import frTranslations from '@/locales/fr';
import arTranslations from '@/locales/ar';
import enTranslations from '@/locales/en';

type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, defaultValue?: string) => string;
}

const translations = {
  fr: frTranslations,
  ar: arTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const hasLoadedLanguage = useRef(false);

  // Load language from localStorage or settings API (only once)
  useEffect(() => {
    if (hasLoadedLanguage.current) return;
    
    const loadLanguage = async () => {
      // First, load from localStorage immediately (no API call needed)
      const savedLanguage = (localStorage.getItem('dashboard_language') || 'fr') as Language;
      if (['fr', 'ar', 'en'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = savedLanguage;
          document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
        }
      }
      
      // Then, try to load from settings API if authenticated
      // Only do this if we have a token (user is authenticated)
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('admin_token');
      if (hasToken) {
        try {
          const response = await apiService.getAdminSettings();
          if (response.success && response.data?.settings?.language) {
            const lang = response.data.settings.language as Language;
            if (['fr', 'ar', 'en'].includes(lang)) {
              setLanguageState(lang);
              localStorage.setItem('dashboard_language', lang);
              if (typeof document !== 'undefined') {
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
              }
            }
          }
        } catch (error) {
          // Silently fail - we already have language from localStorage
          console.debug('Could not load language from settings API:', error);
        }
      }
      
      hasLoadedLanguage.current = true;
    };

    loadLanguage();
  }, []);

  const setLanguage = useCallback(async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('dashboard_language', newLanguage);
    
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    }
    
    // Update settings API
    try {
      await apiService.updateAdminSettings({
        language: newLanguage,
      });
    } catch (error) {
      console.error('Failed to update language in settings:', error);
      // Continue anyway, it's saved in localStorage
    }
  }, []);

  // Translation function
  const t = useCallback((key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof value === 'string' ? value : (defaultValue || key);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

