import { ThemeColors, ThemeKey } from "./types";

const DarkThemeColors: ThemeColors = {
    backgroundColor: "#2e2e2e",
    secondaryBackgroundColor: "#333",
    inputFieldBackgroundColor: "#222",
    secondaryInputFieldBackgroundColor: "#2a2a2a",
    componentBackgroundColor: "#3c3c3c",
    textDisabled: "#444",
    errorColor: "rgba(255,0,0,0.5)",
    secondaryErrorColor: "rgba(170,0,0,0.5)",
    mainColor: "#eee",
    secondaryColor: "#888",
    primaryColor: "#222",
    warningColor: "#af7d00",
    successColor: "#006600",
    cta: "#bafa4d",
    textCta: "#2e2e2e",
};
const LightThemeColors: ThemeColors = {
    backgroundColor: "#ddd",
    secondaryBackgroundColor: "#ddd",
    inputFieldBackgroundColor: "#aaa",
    secondaryInputFieldBackgroundColor: "#cacaca",
    componentBackgroundColor: "#ccc",
    textDisabled: "#aaa",
    errorColor: "rgba(255,0,0,0.5)",
    secondaryErrorColor: "rgba(170,0,0,0.5)",
    mainColor: "#333",
    secondaryColor: "#777",
    primaryColor: "#5544ff",
    warningColor: "#af7d00",
    successColor: "#00dd00",
    cta: "#5427c9",
    textCta: "#2e2e2e",
};

export const ThemeConfig: Record<ThemeKey, ThemeColors> = {
    dark: DarkThemeColors,
    light: LightThemeColors,
};
