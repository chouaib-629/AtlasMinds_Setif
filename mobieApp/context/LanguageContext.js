import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as translations from '../locales';

const LanguageContext = createContext({});

const STORAGE_KEY = '@app_language';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      setLanguage(lang);
    } catch (error) {
      // Silent error handling
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    loading,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

