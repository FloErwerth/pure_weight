import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import type { ThemeKey } from "./types";
import { ThemeConfig } from "./config";
import { noop } from "lodash";
import { useAppDispatch, useAppSelector } from "../store";
import { setTheme } from "../store/reducer";
import { getTheme } from "../store/selectors";

export const themeContext = createContext<{ theme: ThemeKey; setTheme: Dispatch<SetStateAction<ThemeKey>> }>({ theme: "dark", setTheme: noop });

export const useTheme = () => {
  const { theme } = useContext(themeContext);
  return useMemo(() => ThemeConfig[theme], [theme]);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useAppSelector(getTheme);
  const [localTheme, setLocalTheme] = useState<ThemeKey>(theme ?? "dark");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme(localTheme));
  }, [dispatch, localTheme]);

  return <themeContext.Provider value={{ theme: localTheme, setTheme: setLocalTheme }}>{children}</themeContext.Provider>;
};
