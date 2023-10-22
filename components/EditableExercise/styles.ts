import { StyleSheet } from "react-native";
import { componentBackgroundColor, errorColor, mainColor, secondaryColor, secondaryComponentBackgroundColor, textFieldBackgroundColor } from "../App/theme/colors";
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
      padding: 10,
      backgroundColor: componentBackgroundColor,
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
    wrapperError: {
      borderColor: errorColor,
    },
    text: {
      color: secondaryColor,
    },
    buttonText: {
      color: mainColor,
      fontSize: 16,
    },
    input: {
      backgroundColor: textFieldBackgroundColor,
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
      backgroundColor: secondaryComponentBackgroundColor,
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
      padding: 10,
      borderRadius,
    },
  });
