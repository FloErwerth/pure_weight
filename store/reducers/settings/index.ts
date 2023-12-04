import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language, UnitSystem } from "./types";
import { ThemeKey } from "../../../theme/types";

export type SettingsState = { language: Language; theme: ThemeKey; unitSystem: UnitSystem; smallestWeight: string };

export const setSettingsState = createAction<SettingsState, "settings_set_state">("settings_set_state");
export const setLanguage = createAction<Language, "settings_set_language">("settings_set_language");
export const setTheme = createAction<ThemeKey, "theme_set">("theme_set");
export const setUnitSystem = createAction<UnitSystem, "set_unit_system">("set_unit_system");
export const setSmallestWeight = createAction<string, "set_smallest_weight">("set_smallest_weight");

export type SettingsAction = typeof setSettingsState.type | typeof setLanguage.type | typeof setTheme.type | typeof setUnitSystem.type;

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
        unitSystem: "metric",
        smallestWeight: "1.25",
    },
    (builder) => {
        builder
            .addCase(setSettingsState, (_, action) => {
                return action.payload;
            })
            .addCase(setSmallestWeight, (state, action) => {
                state.smallestWeight = action.payload;
            })
            .addCase(setLanguage, (state, action) => {
                state.language = action.payload;
            })
            .addCase(setTheme, (state, action) => {
                state.theme = action.payload;
            })
            .addCase(setUnitSystem, (state, action) => {
                state.unitSystem = action.payload;
            });
    },
);
