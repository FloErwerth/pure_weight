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
    },
    text: {
      color: "black",
    },
  },
};

export const styles = (theme: ButtonThemes) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      padding: 10,
      width: 100,
    },
    commonText: {
      textAlign: "center",
    },
    button: themes[theme].button,
    text: themes[theme].text,
  });
