import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    borderRadius,
    padding: 10,
  },
  pressableStack: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
