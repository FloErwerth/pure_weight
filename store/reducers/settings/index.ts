import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language, UnitSystem } from "./types";
import { ThemeKey } from "../../../theme/types";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export type StopwatchSettings = {
    startOnDoneSet: boolean;
    notifications: { allowed: false } | { allowed: true; notify: boolean };
};
export type SettingsState = {
    language: Language;
    theme: ThemeKey | "system";
    unitSystem: UnitSystem;
    keepAwake: boolean;
    stopwatchSettings: StopwatchSettings;
    searchManual?: string;
    switchToNextExercise: boolean;
};
export const setSettingsState = createAction<SettingsState, "settings_set_state">("settings_set_state");
export const setKeepAwake = createAction<boolean, "settings_keep_awake">("settings_keep_awake");
export const setLanguage = createAction<Language, "settings_set_language">("settings_set_language");
export const setTheme = createAction<ThemeKey, "theme_set">("theme_set");
export const setUnitSystem = createAction<UnitSystem, "set_unit_system">("set_unit_system");
export const setSearchManual = createAction<string | undefined, "set_search_manual">("set_search_manual");
export const setSwitchToNextExercise = createAction<boolean, "set_switch_to_next_exercise">("set_switch_to_next_exercise");
export const mutateStopwatchSettings = createAction<
    { key: keyof StopwatchSettings; value: StopwatchSettings[keyof StopwatchSettings] },
    "set_stopwatch_settings"
>("set_stopwatch_settings");

export type SettingsAction =
    | typeof setSettingsState.type
    | typeof setLanguage.type
    | typeof setTheme.type
    | typeof setUnitSystem.type
    | typeof setKeepAwake.type;

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
        unitSystem: "metric",
        keepAwake: true,
        switchToNextExercise: false,
        stopwatchSettings: { startOnDoneSet: false, notifications: { allowed: true, notify: true } },
    },
    (builder) => {
        builder
            .addCase(setSettingsState, (_, action) => {
                return action.payload;
            })
            .addCase(setSearchManual, (state, action) => {
                state.searchManual = action.payload;
            })
            .addCase(mutateStopwatchSettings, (state, action) => {
                state.stopwatchSettings = { ...state.stopwatchSettings, [action.payload.key]: action.payload.value };
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
            })
            .addCase(setSwitchToNextExercise, (state, action) => {
                state.switchToNextExercise = action.payload;
            });
    },
);
