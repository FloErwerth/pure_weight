import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Language } from "./types";
import { ThemeKey } from "../../../theme/types";

export type SettingsState = { language: Language; theme: ThemeKey };
export const setLanguage = createAction<Language>("settings_set_language");
export const setTheme = createAction<ThemeKey>("theme_set");

export const settingsRecuder = createReducer<SettingsState>(
    {
        theme: "dark",
        language: "en",
    },
    (builder) => {
        builder
            .addCase(setLanguage, (state, action) => {
                state.language = action.payload;
            })
            .addCase(setTheme, (state, action) => {
                state.theme = action.payload;
            });
    },
);
