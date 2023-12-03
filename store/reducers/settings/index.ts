import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language, WeightUnit } from "./types";
import { ThemeKey } from "../../../theme/types";

export type SettingsState = { language: Language; theme: ThemeKey; weightUnit: WeightUnit };

export const setSettingsState = createAction<SettingsState, "settings_set_state">("settings_set_state");
export const setLanguage = createAction<Language, "settings_set_language">("settings_set_language");
export const setTheme = createAction<ThemeKey, "theme_set">("theme_set");
export const setWeightUnit = createAction<WeightUnit, "weight_unit_set">("weight_unit_set");

export type SettingsAction = typeof setSettingsState.type | typeof setLanguage.type | typeof setTheme.type | typeof setWeightUnit.type;

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
        weightUnit: "kg",
    },
    (builder) => {
        builder
            .addCase(setSettingsState, (_, action) => {
                return action.payload;
            })
            .addCase(setLanguage, (state, action) => {
                state.language = action.payload;
            })
            .addCase(setTheme, (state, action) => {
                state.theme = action.payload;
            })
            .addCase(setWeightUnit, (state, action) => {
                state.weightUnit = action.payload;
            });
    },
);
