import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";

export const getSettingsState = ({ settingsState }: AppState) => settingsState;
export const getThemeKey = createSelector([getSettingsState], (settings) => settings.theme);
export const getLanguage = createSelector([getSettingsState], (settings) => settings.language);
