import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";
import { useAppSelector } from "../store";
import { getLanguage } from "../store/reducers/settings/settingsSelectors";

let initialized = false;
export const useInitIntl = () => {
    const language = useAppSelector(getLanguage);
    if (!initialized) {
        void i18n.use(initReactI18next).init({
            lng: language,
            fallbackLng: "de",
            compatibilityJSON: "v3",
            resources: { en: { translation: en }, de: { translation: de } },
        });
    }
    initialized = true;
};
