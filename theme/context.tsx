import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import type { ThemeKey } from "./types";
import { ThemeConfig } from "./config";
import { useAppSelector } from "../store";
import { getThemeKey } from "../store/selectors";
import { Appearance } from "react-native";

export const themeContext = createContext<ThemeKey>(Appearance.getColorScheme() ?? "dark");

export const useTheme = () => {
  const theme = useContext(themeContext);
  return useMemo(() => ThemeConfig[theme], [theme]);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useAppSelector(getThemeKey);

  return <themeContext.Provider value={theme}>{children}</themeContext.Provider>;
};
