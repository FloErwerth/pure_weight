import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import type { ThemeKey } from "./types";
import { ThemeConfig } from "./config";
import { useAppSelector } from "../store";
import { Appearance } from "react-native";

import { getThemeKeyFromStore } from "../store/reducers/settings/settingsSelectors";

export const themeContext = createContext<ThemeKey>(Appearance.getColorScheme() ?? "dark");

export const useTheme = () => {
    const theme = useContext(themeContext);
    return useMemo(() => ThemeConfig[theme ?? "dark"], [theme]);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const theme = useAppSelector(getThemeKeyFromStore);
    return <themeContext.Provider value={theme}>{children}</themeContext.Provider>;
};
