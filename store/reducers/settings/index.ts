import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language, UnitSystem } from "./types";
import { ThemeKey } from "../../../theme/types";

export type SettingsState = { language: Language; theme: ThemeKey; unitSystem: UnitSystem };

export const setSettingsState = createAction<SettingsState, "settings_set_state">("settings_set_state");
export const setLanguage = createAction<Language, "settings_set_language">("settings_set_language");
export const setTheme = createAction<ThemeKey, "theme_set">("theme_set");
export const setWeightUnit = createAction<UnitSystem, "weight_unit_set">("weight_unit_set");

export type SettingsAction = typeof setSettingsState.type | typeof setLanguage.type | typeof setTheme.type | typeof setWeightUnit.type;

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
        unitSystem: "metric",
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
                state.unitSystem = action.payload;
            });
    },
);
