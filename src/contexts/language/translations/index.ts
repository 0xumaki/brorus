
import { Language } from "../types";
import englishTranslations from "./english";
import burmeseTranslations from "./burmese";

// Combine all translations into a single object
const translations: Record<Language, Record<string, string>> = {
  english: englishTranslations,
  burmese: burmeseTranslations,
};

export default translations;
