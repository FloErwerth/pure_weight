import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  contentWrapper: {
    gap: 20,
  },
  measurementsWrapper: {
    gap: 10,
  },
  pressableWrapper: {
    borderRadius,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  text: { fontSize: 26 },
});
