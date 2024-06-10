import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { useAppSelector } from "../store";
import { getLanguage } from "../store/selectors/settings/settingsSelectors";
import { EnglischResource } from "./EnglischResource";
import { GermanResource } from "./GermanResource";
import { useCallback } from "react";
import { TranslationKeys } from "./translationKeys";

const initialized = false;
export const useInitIntl = () => {
    const language = useAppSelector(getLanguage);
    if (!initialized) {
        void i18n.use(initReactI18next).init({
            lng: language,
            fallbackLng: "de",
            compatibilityJSON: "v3",
            initImmediate: false,
            resources: { en: { translation: EnglischResource }, de: { translation: GermanResource } },
        });
    }
};

export const useTypedTranslation = () => {
    const { t } = useTranslation();

    const _t = useCallback(
        (key: TranslationKeys) => {
            return t(key);
        },
        [t],
    );

    return { t: _t };
};
