import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en/translation.json";
import kmTranslations from "./locales/km/translation.json";

const resources = {
  en: { translation: enTranslations },
  km: { translation: kmTranslations }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", // default language
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
