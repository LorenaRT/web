import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import esTranslation from "./es";

i18n.use(initReactI18next).init({
  debug: false,
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    es: {
      translation: esTranslation,
    },
  },
  react: { useSuspense: false },
});

export default i18n;
