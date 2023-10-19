import { StyleSheet } from "react-native";
import { componentBackgroundColor, errorColor, mainColor, secondaryColor, textFieldBackgroundColor } from "../App/theme/colors";
import { borderRadius } from "../App/theme/border";

export type EditableExerciseTheme = "Inline" | "Default";
const Themes = {
  Inline: {
    innerWrapper: {
      padding: 0,
      backgroundColor: componentBackgroundColor,
    },
  },
  Default: {
    innerWrapper: {
      padding: 16,
      paddingBottom: 0,
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
    wrapperError: {
      borderColor: errorColor,
    },
    text: {
      color: secondaryColor,
    },
    input: {
      backgroundColor: textFieldBackgroundColor,
      alignSelf: "stretch",
      padding: 10,
      borderRadius,
    },
    inputWrapper: {
      paddingRight: 32,
      top: -10,
      paddingTop: 16,
    },
    buttons: {
      gap: 18,
    },
    innerWrapper: {
      ...Themes[theme].innerWrapper,
      gap: 10,
      borderRadius,
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
      borderWidth: 1,
      borderColor: "transparent",
      backgroundColor: textFieldBackgroundColor,
      alignSelf: "stretch",
      marginRight: 15,
      padding: 10,
      borderRadius,
    },
  });
