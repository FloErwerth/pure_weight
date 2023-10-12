import { StyleSheet } from "react-native";
import { componentBackgroundColor } from "../../app/theme/colors";
import { borderRadius } from "../../app/theme/border";

export const styles = StyleSheet.create({
  add: {
    justifyContent: "center",
    flex: 1,
    alignSelf: "stretch",
    borderRadius,
    padding: 15,
    backgroundColor: componentBackgroundColor,
  },
  text: {
    fontSize: 20,
  },
});
