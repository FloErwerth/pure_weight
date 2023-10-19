import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import type { ButtonThemes } from "./Button";
import { borderRadius } from "../App/theme/border";
import { mainColor, primaryColor } from "../App/theme/colors";

const themes: Record<ButtonThemes, Record<"button" | "text", ViewStyle | TextStyle>> = {
  primary: {
    singleButton: {
      padding: 10,
      backgroundColor: primaryColor,
      borderRadius,
      borderColor: "black",
    },
    text: {
      color: "white",
    },
  },
  secondary: {
    singleButton: {
      padding: 10,
      borderWidth: 1,
      borderRadius,
      borderColor: primaryColor,
    },
    text: {
      color: mainColor,
    },
  },
  ghost: {
    singleButton: {
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

export const styles = (theme: ButtonThemes) =>
  StyleSheet.create({
    commonText: {
      textAlign: "center",
    },
    singleButton: themes[theme].singleButton,
    text: themes[theme].text,
  });
