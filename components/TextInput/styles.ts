import { StyleSheet } from "react-native";
import { errorColor } from "../App/theme/colors";

export const styles = StyleSheet.create({
  error: {
    color: errorColor,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: errorColor,
  },
});
