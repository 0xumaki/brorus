import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, LanguageContextType, TranslationKey } from "./types";
import translations from "./translations";
import { getInitialLanguage, formatNumber, formatNumberEnglish, formatCurrency, translateWithParams } from "./utils";

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());

  // Translate function that handles how components are currently using it
  const t = (key: TranslationKey, paramsOrDefault?: Record<string, any> | string): string => {
    // Get the translation for the current language
    const translatedText = translations[language][key];
    if (translatedText) {
      return translateWithParams(translatedText, paramsOrDefault);
    }
    if (typeof paramsOrDefault === 'string') {
      return paramsOrDefault;
    }
    return key;
  };

  // Format number according to current language
  const formatNumberWithLanguage = (number: number, options?: Intl.NumberFormatOptions): string => {
    return formatNumber(number, language, options);
  };

  // Format number in English notation regardless of language
  const formatNumberEnglishOnly = (number: number, options?: Intl.NumberFormatOptions): string => {
    return formatNumberEnglish(number, options);
  };

  // Format currency according to current language
  const formatCurrencyWithLanguage = (amount: number, currency?: string): string => {
    return formatCurrency(amount, currency, language);
  };

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Debug logging
    console.log("Language set to:", language);
    console.log("Sample translation for 'p2p.advertiser':", translations[language]["p2p.advertiser"] || "missing translation");
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      formatNumber: formatNumberWithLanguage,
      formatNumberEnglish: formatNumberEnglishOnly,
      formatCurrency: formatCurrencyWithLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
