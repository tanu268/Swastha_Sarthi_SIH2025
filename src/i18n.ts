// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// optional detector:
// import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
// import bn from "./locales/bn/translation.json";
// import te from "./locales/te/translation.json";

i18n
  // .use(LanguageDetector) // optional: detect browser lang
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      // bn: { translation: bn },
      // te: { translation: te }
    },
    lng: localStorage.getItem("appLang") || "en", // initial language
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
