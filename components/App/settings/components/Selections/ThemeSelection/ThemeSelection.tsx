import { Appearance } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo, useState } from "react";
import { ThemeKey } from "../../../../../../theme/types";
import { setTheme } from "../../../../../../store/reducers/settings";

import { getThemeKeyFromStore } from "../../../../../../store/selectors/settings/settingsSelectors";
import { Icon, SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { PageContent } from "../../../../../PageContent/PageContent";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

const dark: Icon = {
    name: "weather-night",
    size: 24,
};

const light: Icon = {
    name: "weather-sunny",
    size: 24,
};
const device: Icon = {
    name: "theme-light-dark",
    size: 24,
};

export const ThemeSelection = () => {
    const { t } = useTypedTranslation();
    const [usesDeviceTheme, setUsesDeviceTheme] = useState(false);
    const dispatch = useAppDispatch();
    const theme = useAppSelector(getThemeKeyFromStore);
    const { ref, openBottomSheet } = useBottomSheetRef();

    const handleSelectLanguage = useCallback(
        (themeKey: ThemeKey | "device") => {
            if (themeKey === "device") {
                dispatch(setTheme(Appearance.getColorScheme() || "dark"));
                setUsesDeviceTheme(true);
                return;
            }
            setUsesDeviceTheme(false);
            dispatch(setTheme(themeKey));
        },
        [dispatch],
    );

    const themeTitle = useMemo(() => t(TranslationKeys.SETTINGS_THEME), [t]);
    const handleSelectLightTheme = useCallback(() => handleSelectLanguage("light"), [handleSelectLanguage]);
    const handleSelectDarkTheme = useCallback(() => handleSelectLanguage("dark"), [handleSelectLanguage]);
    const handleSelectDeviceTheme = useCallback(() => handleSelectLanguage("device"), [handleSelectLanguage]);

    return (
        <ThemedView ghost>
            <SettingsNavigator title={themeTitle} onPress={openBottomSheet} />

            <ThemedBottomSheetModal ref={ref} title={themeTitle}>
                <PageContent paddingTop={20} ghost>
                    <SelectableSetting prependedExtraContent={light} selected={!usesDeviceTheme && theme === "light"} onSelect={handleSelectLightTheme} titleKey={TranslationKeys.THEME_LIGHT} />
                    <SelectableSetting prependedExtraContent={dark} selected={!usesDeviceTheme && theme === "dark"} onSelect={handleSelectDarkTheme} titleKey={TranslationKeys.THEME_DARK} />
                    <SelectableSetting prependedExtraContent={device} selected={usesDeviceTheme} onSelect={handleSelectDeviceTheme} titleKey={TranslationKeys.THEME_DEVICE} />
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
