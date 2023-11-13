import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    gap: 10,
    borderRadius,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  outerWrapper: {
    zIndex: -1,
  },
});
