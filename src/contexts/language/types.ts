// Define available languages
export type Language = "english" | "burmese";

// Define translation key structure
export type TranslationKey = string;

// Define translations object structure
export type TranslationsObject = Record<TranslationKey, string>;

// Define the context type
export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, paramsOrDefault?: Record<string, any> | string) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatNumberEnglish: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}
