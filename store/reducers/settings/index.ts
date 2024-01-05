import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language, UnitSystem } from "./types";
import { ThemeKey } from "../../../theme/types";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export type NumberEntries = "10" | "25" | "100" | "ALL";
export type StopwatchSettings = { startOnDoneSet: boolean; startOnLastSet: boolean; notifications: { allowed: false } | { allowed: true; notify: boolean } };
export type SettingsState = {
    language: Language;
    theme: ThemeKey;
    unitSystem: UnitSystem;
    keepAwake: boolean;
    stopwatchSettings: StopwatchSettings;
    deletionTimeMs: number;
    switchToNextExercise: boolean;
    searchManual?: string;
};
export const setSettingsState = createAction<SettingsState, "settings_set_state">("settings_set_state");
export const setKeepAwake = createAction<boolean, "settings_keep_awake">("settings_keep_awake");
export const setLanguage = createAction<Language, "settings_set_language">("settings_set_language");
export const setTheme = createAction<ThemeKey, "theme_set">("theme_set");
export const setUnitSystem = createAction<UnitSystem, "set_unit_system">("set_unit_system");
export const setDeletionTimeMs = createAction<number, "set_deletion_time">("set_deletion_time");
export const setSearchManual = createAction<string | undefined, "set_search_manual">("set_search_manual");
export const setStopwatchSettings = createAction<Partial<StopwatchSettings>, "set_stopwatch_settings">("set_stopwatch_settings");
export const setSwitchToNextExercise = createAction<Partial<boolean>, "set_switch_to_next_exercise">("set_switch_to_next_exercise");

export type SettingsAction = typeof setSettingsState.type | typeof setLanguage.type | typeof setTheme.type | typeof setUnitSystem.type | typeof setKeepAwake.type;

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
        unitSystem: "metric",
        keepAwake: true,
        stopwatchSettings: { startOnDoneSet: false, startOnLastSet: false, notifications: { allowed: true, notify: true } },
        deletionTimeMs: 5000,
        switchToNextExercise: true,
    },
    (builder) => {
        builder
            .addCase(setSettingsState, (_, action) => {
                return action.payload;
            })
            .addCase(setSearchManual, (state, action) => {
                state.searchManual = action.payload;
            })
            .addCase(setSwitchToNextExercise, (state, action) => {
                state.switchToNextExercise = action.payload;
            })
            .addCase(setStopwatchSettings, (state, action) => {
                state.stopwatchSettings = { ...state.stopwatchSettings, ...action.payload };
            })
            .addCase(setDeletionTimeMs, (state, action) => {
                state.deletionTimeMs = action.payload;
            })
            .addCase(setKeepAwake, (state, action) => {
                if (action.payload) {
                    void activateKeepAwakeAsync();
                } else {
                    void deactivateKeepAwake();
                }
                state.keepAwake = action.payload;
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
