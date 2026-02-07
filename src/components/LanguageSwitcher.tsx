"use client";

import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSwitcher() {
  const { language, toggleLanguage, isInitialized } = useLanguage();

  if (!isInitialized) {
    return null; // Prevent flash of wrong language
  }

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 px-4 py-2 flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300"
      aria-label="Switch language"
    >
      <span className="text-xl">{language === 'zh' ? '🇨🇳' : '🇺🇸'}</span>
      <span className="font-medium text-sm text-gray-700">
        {language === 'zh' ? '中文' : 'English'}
      </span>
    </button>
  );
}
