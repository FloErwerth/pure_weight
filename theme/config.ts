import { ThemeColors, ThemeKey } from "./types";

const DarkThemeColors: ThemeColors = {
  backgroundColor: "#2e2e2e",
  secondaryBackgroundColor: "#333",
  inputFieldBackgroundColor: "#222",
  componentBackgroundColor: "#3c3c3c",
  textDisabled: "#666",
  errorColor: "rgba(255,0,0,0.5)",
  secondaryErrorColor: "rgba(170,0,0,0.5)",
  mainColor: "#ddd",
  secondaryColor: "#888",
  primaryColor: "#0066aa",
  warningColor: "#af7d00",
};
const LightThemeColors: ThemeColors = {
  backgroundColor: "#ddd",
  secondaryBackgroundColor: "#ccc",
  inputFieldBackgroundColor: "#ddd",
  componentBackgroundColor: "#eee",
  textDisabled: "#ccc",
  errorColor: "rgba(255,0,0,0.5)",
  secondaryErrorColor: "rgba(170,0,0,0.5)",
  mainColor: "#111",
  secondaryColor: "#777",
  primaryColor: "#5544ff",
  warningColor: "#af7d00",
};

export const ThemeConfig: Record<ThemeKey, ThemeColors> = {
  dark: DarkThemeColors,
  light: LightThemeColors,
};
