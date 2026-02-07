/**
 * Internationalization (i18n) utility
 * Supports Chinese and English with browser language detection
 */

export type Language = 'zh' | 'en';

export interface I18nConfig {
  defaultLanguage: Language;
  supportedLanguages: Language[];
}

const config: I18nConfig = {
  defaultLanguage: 'en',
  supportedLanguages: ['zh', 'en'],
};

/**
 * Detect browser language
 * @returns 'zh' if browser language is Chinese, otherwise 'en'
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') {
    return config.defaultLanguage;
  }

  const browserLang = navigator.language.toLowerCase();
  
  // Check if browser language is Chinese (zh, zh-CN, zh-TW, etc.)
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }

  // Check if it's a supported language
  for (const lang of config.supportedLanguages) {
    if (browserLang.startsWith(lang)) {
      return lang;
    }
  }

  // Default to English if no match
  return config.defaultLanguage;
}

/**
 * Get stored language preference from localStorage
 */
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('app-language');
  if (stored && config.supportedLanguages.includes(stored as Language)) {
    return stored as Language;
  }

  return null;
}

/**
 * Store language preference to localStorage
 */
export function setStoredLanguage(language: Language): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('app-language', language);
}

/**
 * Get current language based on stored preference or browser detection
 */
export function getCurrentLanguage(): Language {
  return getStoredLanguage() || detectBrowserLanguage();
}
