import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from "react";
import type { ThemeKey } from "./types";
import { ThemeConfig } from "./config";
import { noop } from "lodash";

export const themeContext = createContext<{ theme: ThemeKey; setTheme: Dispatch<SetStateAction<ThemeKey>> }>({ theme: "dark", setTheme: noop });

export const useTheme = () => {
  const { theme } = useContext(themeContext);
  return useMemo(() => ThemeConfig[theme], [theme]);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [localTheme, setLocalTheme] = useState<ThemeKey>("dark");

  return <themeContext.Provider value={{ theme: localTheme, setTheme: setLocalTheme }}>{children}</themeContext.Provider>;
};
