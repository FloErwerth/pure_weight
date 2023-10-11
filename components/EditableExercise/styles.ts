import { StyleSheet } from "react-native";

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
      backgroundColor: "white",
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
    },
    title: {
      flex: 1,
      fontSize: 20,
      lineHeight: 23,
    },
  });
