import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en';
import es from './es';

export const LANGUAGE_STORAGE_KEY = 'user-language-preference';

const i18n = new I18n({
  en,
  es,
});

// Default to system locale, but will be updated from storage when available
i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Add type safety for translations
type TranslationKeys = keyof typeof en;

export const t = (key: string, params?: Record<string, string | number>) => {
  return i18n.t(key, params);
};

// Function to change language
export const changeLanguage = async (lang: 'en' | 'es') => {
  // Update i18n locale
  i18n.locale = lang;
  
  // Store language preference
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.error('Failed to save language preference', error);
  }
};

// Function to load saved language preference
export const loadSavedLanguage = async (): Promise<string | null> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      i18n.locale = savedLanguage;
      return savedLanguage;
    }
  } catch (error) {
    console.error('Failed to load language preference', error);
  }
  return null;
};

export default i18n; 