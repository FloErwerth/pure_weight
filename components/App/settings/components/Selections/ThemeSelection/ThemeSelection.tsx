import { Appearance } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useState } from "react";
import { ThemeKey } from "../../../../../../theme/types";
import { setTheme } from "../../../../../../store/reducers/settings";

import { getThemeKeyFromStore } from "../../../../../../store/reducers/settings/settingsSelectors";
import { Icon, SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { PageContent } from "../../../../../PageContent/PageContent";

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
    const { t } = useTranslation();
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

    return (
        <ThemedView ghost>
            <SettingsNavigator title={t("settings_theme")} onPress={openBottomSheet} />

            <ThemedBottomSheetModal ref={ref} title={t("settings_theme")}>
                <PageContent paddingTop={20} ghost>
                    <SelectableSetting
                        prependedExtraContent={light}
                        selected={!usesDeviceTheme && theme === "light"}
                        onSelect={() => handleSelectLanguage("light")}
                        titleKey="theme_light"
                    />
                    <SelectableSetting
                        prependedExtraContent={dark}
                        selected={!usesDeviceTheme && theme === "dark"}
                        onSelect={() => handleSelectLanguage("dark")}
                        titleKey="theme_dark"
                    />
                    <SelectableSetting
                        prependedExtraContent={device}
                        selected={usesDeviceTheme}
                        onSelect={() => handleSelectLanguage("device")}
                        titleKey="theme_device"
                    />
                </PageContent>
            </ThemedBottomSheetModal>
        </ThemedView>
    );
};
