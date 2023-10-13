import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import type { ButtonThemes } from "./Button";
import { borderRadius } from "../../app/theme/border";
import { mainColor, textFieldBackgroundColor } from "../../app/theme/colors";

const themes = (disabled: boolean): Record<ButtonThemes, Record<"button" | "text", ViewStyle | TextStyle>> => ({
  primary: {
    button: {
      padding: 10,
      backgroundColor: textFieldBackgroundColor,
      borderRadius,
      borderColor: "black",
    },
    text: {
      color: "white",
    },
  },
  secondary: {
    button: {
      padding: 10,
      borderWidth: 1,
      borderRadius,
      borderColor: textFieldBackgroundColor,
    },
    text: {
      color: mainColor,
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
});

export const styles = (theme: ButtonThemes, disabled: boolean = false) =>
  StyleSheet.create({
    commonText: {
      textAlign: "center",
    },
    button: themes(disabled)[theme].button,
    text: themes(disabled)[theme].text,
  });
