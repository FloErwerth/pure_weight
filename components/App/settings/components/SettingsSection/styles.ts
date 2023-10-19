import { StyleSheet } from "react-native";
import { componentBackgroundColor, mainColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    padding: 10,
    backgroundColor: componentBackgroundColor,
    borderRadius,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    color: mainColor,
  },
  outerWrapper: {
    margin: 20,
  },
});
