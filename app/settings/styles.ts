import { StyleSheet } from "react-native";
import { mainColor } from "../theme/colors";

export const styles = StyleSheet.create({
  languageWrapper: {
    gap: 20,
    justifyContent: "space-around",
  },
  languageTitle: {
    fontSize: 20,
    color: mainColor,
    alignSelf: "center",
  },
});
