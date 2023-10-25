import { ThemeColors, ThemeKey } from "./types";

export const textDisabled = "#666";
const DarkThemeColors: ThemeColors = {
  backgroundColor: "#2e2e2e",
  secondaryBackgroundColor: "#333",
  inputFieldBackgroundColor: "#222",
  componentBackgroundColor: "#3c3c3c",
  textDisabled,
  errorColor: "rgba(255,0,0,0.5)",
  secondaryErrorColor: "rgba(170,0,0,0.5)",
  mainColor: "#ddd",
  secondaryColor: "#888",
  primaryColor: "#333",
  warningColor: "#af7d00",
};
const LightThemeColors: ThemeColors = {
  backgroundColor: "#ddd",
  secondaryBackgroundColor: "#aaa",
  inputFieldBackgroundColor: "white",
  componentBackgroundColor: "#eee",
  textDisabled,
  errorColor: "rgba(255,0,0,0.5)",
  secondaryErrorColor: "rgba(170,0,0,0.5)",
  mainColor: "#111",
  secondaryColor: "#444",
  primaryColor: "#fff",
  warningColor: "#af7d00",
};

export const ThemeConfig: Record<ThemeKey, ThemeColors> = {
  dark: DarkThemeColors,
  light: LightThemeColors,
};
