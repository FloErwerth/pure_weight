import { StyleSheet } from "react-native";
import { componentBackgroundColor } from "../App/theme/colors";
import { borderRadius } from "../App/theme/border";

export const styles = StyleSheet.create({
  add: {
    borderWidth: 1,
    justifyContent: "center",
    borderRadius,
    padding: 15,
    backgroundColor: componentBackgroundColor,
  },
  text: {
    textAlign: "center",

    paddingLeft: 10,
    fontSize: 20,
  },
});
