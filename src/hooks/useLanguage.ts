"use client";

import { useState, useEffect } from 'react';
import { 
  Language, 
  getCurrentLanguage, 
  setStoredLanguage 
} from '@/lib/i18n';

/**
 * Hook for managing application language
 * Automatically detects browser language on mount
 */
export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize language on client side
    const currentLang = getCurrentLanguage();
    setLanguage(currentLang);
    setIsInitialized(true);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setStoredLanguage(newLanguage);
    // Reload the page to apply language change throughout the app
    window.location.reload();
  };

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'zh' ? 'en' : 'zh';
    changeLanguage(newLanguage);
  };

  return {
    language,
    changeLanguage,
    toggleLanguage,
    isInitialized,
  };
}
