import { StyleSheet } from "react-native";
import { componentBackgroundColor, mainColor } from "../../app/theme/colors";

export type EditableExerciseTheme = "Inline" | "Default";
const Themes = {
  Inline: {
    wrapper: {
      padding: 0,
      backgroundColor: "transparent",
    },
  },
  Default: {
    wrapper: {
      padding: 16,
      backgroundColor: componentBackgroundColor,
    },
  },
};

export const styles = (theme: EditableExerciseTheme = "Default") =>
  StyleSheet.create({
    headerWrapper: {
      justifyContent: "space-between",
      alignSelf: "stretch",
      alignItems: "center",
    },
    inputWrapper: {
      paddingRight: 32,
      top: -10,
      paddingTop: 16,
    },
    buttons: {
      gap: 18,
    },
    wrapper: {
      ...Themes[theme].wrapper,
      gap: 10,
      borderRadius: 8,
      alignSelf: "stretch",
    },
    saveText: {
      fontSize: 16,
      color: mainColor,
    },
    title: {
      color: mainColor,
      flex: 1,
      fontSize: 20,
      lineHeight: 23,
    },
  });
