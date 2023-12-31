import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  helperWrapper: {
    height: 17,
  },
  helperText: {
    paddingLeft: 5,
  },
  helperStack: {
    flex: 1,
  },
  innerWrapper: {
    alignSelf: "stretch",
    paddingLeft: 10,
    borderRadius,
    backgroundColor: "lightgrey",
  },
  center: { alignItems: "center" },
});
