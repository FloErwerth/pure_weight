import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";

export const getSettingsState = ({ settingsState }: AppState) => settingsState;
export const getThemeKey = createSelector([getSettingsState], (settings) => settings.theme);
export const getLanguage = createSelector([getSettingsState], (settings) => settings.language);
export const getUnitSystem = createSelector([getSettingsState], (settings) => settings.unitSystem);

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

export const getNumberWorkoutEntries = createSelector([getSettingsState], (settings) => settings.numberWorkoutEntries);
export const getNumberWorkoutEntriesNumber = createSelector([getNumberWorkoutEntries], (number) => {
    if (number === "ALL") {
        return undefined;
    }
    return parseFloat(number);
});

export const getNumberMeasurementEntries = createSelector([getSettingsState], (settings) => settings.numberMeasurementEntries);
export const getNumberMeasurementEntriesNumber = createSelector([getNumberMeasurementEntries], (number) => {
    if (number === "ALL") {
        return undefined;
    }
    return parseFloat(number);
});
