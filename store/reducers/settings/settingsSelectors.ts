import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";
import { WeightUnit } from "./types";

export const getSettingsState = ({ settingsState }: AppState) => settingsState;
export const getThemeKey = createSelector([getSettingsState], (settings) => settings.theme);
export const getLanguage = createSelector([getSettingsState], (settings) => settings.language);
export const getUnitSystem = createSelector([getSettingsState], (settings) => settings.unitSystem);
export const getSmallestWeight = createSelector([getSettingsState], (settings) => settings.smallestWeight);
export const getWeightUnit = createSelector([getUnitSystem], (unitSystem): WeightUnit => {
    switch (unitSystem) {
        case "metric":
            return "kg";
        case "imperial":
            return "lbs";
    }
});
