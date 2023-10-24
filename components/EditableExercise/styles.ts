import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export type EditableExerciseTheme = "Inline" | "Default";
const Themes = {
  Inline: {
    innerWrapper: {
      padding: 0,
    },
  },
  Default: {
    innerWrapper: {
      padding: 10,
    },
  },
};

export const styles = (theme: EditableExerciseTheme = "Default") =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    headerWrapper: {
      alignSelf: "stretch",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
    },
    input: {
      alignSelf: "stretch",
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderRadius,
      borderWidth: 1,
    },
    inputWrapper: {
      paddingVertical: 10,
      alignSelf: "stretch",
    },
    button: {
      alignSelf: "stretch",
      marginHorizontal: 10,
      justifyContent: "center",
      gap: 10,
      padding: 10,
      paddingRight: 8,
      borderRadius,
    },
    buttons: {
      alignSelf: "stretch",
      justifyContent: "space-around",
    },
    innerWrapper: {
      ...Themes[theme].innerWrapper,
      gap: 10,
      borderRadius,
      alignSelf: "stretch",
    },
    saveText: {
      fontSize: 16,
    },
    title: {
      flex: 1,
      fontSize: 20,
      lineHeight: 23,
      borderWidth: 1,
      borderColor: "transparent",
      alignSelf: "stretch",
      padding: 10,
      borderRadius,
    },
  });
