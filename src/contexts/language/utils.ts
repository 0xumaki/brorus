
import { TranslationKey, Language } from "./types";

/**
 * Translates a key with parameters
 * @param text The text to translate
 * @param params Optional parameters to replace in the text
 * @returns The translated text with parameters replaced
 */
export const translateWithParams = (
  text: string,
  params?: Record<string, any> | string
): string => {
  // If params is a string, it's being used as a default value
  if (typeof params === 'string') {
    return text;
  }
  
  // Handle object params for replacements
  if (!params || typeof params !== 'object') return text;
  
  let translatedText = text;
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    translatedText = translatedText.replace(
      `{${paramKey}}`, 
      String(paramValue)
    );
  });
  
  return translatedText;
};

/**
 * Gets the browser's preferred language
 * @returns The detected language or default
 */
export const getInitialLanguage = () => {
  // Try to get the language from localStorage
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage === "english" || savedLanguage === "burmese") {
    return savedLanguage;
  }
  
  // Default to English if not found
  return "english";
};

/**
 * Formats a number according to the current language
 * @param number Number to format
 * @param options Formatting options
 * @returns Formatted number string
 */
export const formatNumber = (
  number: number, 
  language: Language,
  options?: Intl.NumberFormatOptions
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const localeMap: Record<Language, string> = {
    english: 'en-US',
    burmese: 'my-MM'
  };
  
  return number.toLocaleString(localeMap[language], mergedOptions);
};

/**
 * Formats a number in English notation regardless of the selected language
 * @param number Number to format
 * @param options Formatting options
 * @returns Formatted number string in English notation
 */
export const formatNumberEnglish = (
  number: number, 
  options?: Intl.NumberFormatOptions
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Always use en-US locale for English notation
  return number.toLocaleString('en-US', mergedOptions);
};

/**
 * Format currency according to the current language
 * @param amount Amount to format
 * @param currency Currency code
 * @param language Current language
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  language: Language
): string => {
  const localeMap: Record<Language, string> = {
    english: 'en-US',
    burmese: 'my-MM'
  };
  
  // For USD and other international currencies, we'll use standard formatting
  if (currency === 'USD' || currency === '$') {
    return amount.toLocaleString(localeMap[language], {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  // For local currencies, just format the number and append the symbol
  return `${amount.toLocaleString(localeMap[language], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`;
};
