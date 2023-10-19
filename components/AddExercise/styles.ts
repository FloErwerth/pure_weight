import { StyleSheet } from "react-native";
import { componentBackgroundColor } from "../App/theme/colors";
import { borderRadius } from "../App/theme/border";

export const styles = StyleSheet.create({
  add: {
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "stretch",
    borderRadius,
    padding: 15,
    backgroundColor: componentBackgroundColor,
  },
  text: {
    paddingLeft: 10,
    fontSize: 20,
  },
});
