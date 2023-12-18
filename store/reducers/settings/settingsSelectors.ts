import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";

export const getSettingsState = ({ settingsState }: AppState) => settingsState;
export const getThemeKey = createSelector([getSettingsState], (settings) => settings.theme);
export const getLanguage = createSelector([getSettingsState], (settings) => settings.language ?? "en");
export const getUnitSystem = createSelector([getSettingsState], (settings) => settings.unitSystem);
export const getStartStopwatchOnDoneSet = createSelector([getSettingsState], (settings) => settings.stopwatchSettings?.startOnDoneSet);
export const getStartStopwatchOnLastSet = createSelector([getSettingsState], (settings) => settings.stopwatchSettings?.startOnLastSet);
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
        secondsUnit: "sec",
        minutesUnit: "min",
    },
    de: {
        secondsUnit: "sek",
        minutesUnit: "min",
    },
};

export const getWeightUnit = createSelector([getLanguage, getUnitSystem], (language, unitSystem) => {
    return languageUnitSystemWeightUnitMap[language][unitSystem];
});

export const getTimeUnit = createSelector([getLanguage], (language) => {
    return languageUnitSystemTimeUnitsMap[language];
});
