import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import type { ButtonThemes } from "./Button";
import { borderRadius } from "../../app/theme/border";
import { mainColor, textFieldBackgroundColor } from "../../app/theme/colors";

const themes: Record<ButtonThemes, Record<"button" | "text", ViewStyle | TextStyle>> = {
  primary: {
    button: {
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
