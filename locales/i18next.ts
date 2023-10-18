import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";

export default i18n.use(initReactI18next).init({
  lng: "de",
  fallbackLng: "de",
  compatibilityJSON: "v3",
  resources: { en: { translation: en }, de: { translation: de } },
});
