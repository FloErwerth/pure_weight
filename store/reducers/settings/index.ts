import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language, UnitSystem } from "./types";
import { ThemeKey } from "../../../theme/types";

export type NumberEntries = "10" | "25" | "100" | "ALL";
export type SettingsState = { language: Language; theme: ThemeKey; unitSystem: UnitSystem; numberWorkoutEntries: NumberEntries; numberMeasurementEntries: NumberEntries };

export const setSettingsState = createAction<SettingsState, "settings_set_state">("settings_set_state");
export const setLanguage = createAction<Language, "settings_set_language">("settings_set_language");
export const setTheme = createAction<ThemeKey, "theme_set">("theme_set");
export const setUnitSystem = createAction<UnitSystem, "set_unit_system">("set_unit_system");
export const setNumberWorkoutEntries = createAction<NumberEntries, "set_number_workout_entries">("set_number_workout_entries");
export const setNumberMeasurementEntries = createAction<NumberEntries, "set_number_measurement_entries">("set_number_measurement_entries");

export type SettingsAction =
    | typeof setSettingsState.type
    | typeof setLanguage.type
    | typeof setTheme.type
    | typeof setUnitSystem.type
    | typeof setNumberWorkoutEntries.type
    | typeof setNumberMeasurementEntries.type;

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
        unitSystem: "metric",
        numberMeasurementEntries: "10",
        numberWorkoutEntries: "10",
    },
    (builder) => {
        builder
            .addCase(setSettingsState, (_, action) => {
                return action.payload;
            })
            .addCase(setNumberWorkoutEntries, (state, action) => {
                state.numberWorkoutEntries = action.payload;
            })
            .addCase(setNumberMeasurementEntries, (state, action) => {
                state.numberMeasurementEntries = action.payload;
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
