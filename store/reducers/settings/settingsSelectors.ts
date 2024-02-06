import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";
import { Theme } from "@react-navigation/native";
import { ThemeConfig } from "../../../theme/config";
import { Appearance } from "react-native";
import { ThemeKey } from "../../../theme/types";

export const getSettingsState = ({ settingsState }: AppState) => settingsState;
const getThemeKey = (themeKey: ThemeKey | "system") => {
    const colorScheme = Appearance.getColorScheme();
    const mappedColorScheme: ThemeKey = !colorScheme ? "dark" : colorScheme;
    return themeKey === "system" ? mappedColorScheme : themeKey;
};
export const getThemeKeyFromStore = createSelector([getSettingsState], (settings) => getThemeKey(settings.theme));
export const getReactNativeTheme = createSelector([getThemeKeyFromStore], (themeKey) => {
    const themeConfig = ThemeConfig[getThemeKey(themeKey)];
    return {
        dark: themeKey === "dark",
        colors: {
            card: "transparent",
            border: "transparent",
            background: themeConfig.backgroundColor,
            primary: "transparent",
            text: "transparent",
            notification: "transparent",
        },
    } satisfies Theme;
});
export const getLanguage = createSelector([getSettingsState], (settings) => settings.language ?? "en");
export const getUnitSystem = createSelector([getSettingsState], (settings) => settings.unitSystem);
export const getStopwatchSettings = createSelector([getSettingsState], (settings) => settings.stopwatchSettings);
export const getStartStopwatchOnDoneSet = createSelector([getStopwatchSettings], (settings) => Boolean(settings?.startOnDoneSet));
export const getStopwatchNotify = createSelector([getStopwatchSettings], (settings) => settings?.notifications);
export const getSearchManual = createSelector([getSettingsState], (settings) => settings.searchManual);
export const getKeepAwake = createSelector([getSettingsState], (settings) => settings.keepAwake);
const languageUnitSystemWeightUnitMap = {
    en: {
        metric: "kg",
        imperial: "lbs",
    },
    de: {
        metric: "kg",
        imperial: "pfd",
    },
};
const languageUnitSystemTimeUnitsMap = {
    en: {
        secondsUnit: "sec.",
        minutesUnit: "min.",
    },
    de: {
        secondsUnit: "sek.",
        minutesUnit: "min.",
    },
};

export const getWeightUnit = createSelector([getLanguage, getUnitSystem], (language, unitSystem) => {
    return languageUnitSystemWeightUnitMap[language][unitSystem];
});

export const getTimeUnit = createSelector([getLanguage], (language) => {
    return languageUnitSystemTimeUnitsMap[language];
});
