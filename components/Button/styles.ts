import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import type { ButtonThemes } from "./Button";

const themes: Record<ButtonThemes, Record<"button" | "text", ViewStyle | TextStyle>> = {
  primary: {
    button: {
      backgroundColor: "black",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "black",
    },
    text: {
      color: "white",
    },
  },
  secondary: {
    button: {
      backgroundColor: "white",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "black",
    },
    text: {
      color: "black",
    },
  },
  ghost: {
    button: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      padding: 0,
    },
    text: {
      color: "black",
      padding: 0,
    },
  },
};

export const styles = (theme: ButtonThemes, disabled: boolean = false) =>
  StyleSheet.create({
    wrapper: {
      padding: 10,
    },
    commonText: {
      textAlign: "center",
    },
    button: themes[theme].button,
    text: themes[theme].text,
  });
