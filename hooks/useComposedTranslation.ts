import { useTranslation } from "react-i18next";

export const useComposedTranslation = (...translationKeys: string[]) => {
    const { t } = useTranslation();
    return translationKeys.map((key) => t(key)).join(" ");
};
