import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  contentWrapper: {
    gap: 20,
  },
  measurementsWrapper: {
    gap: 10,
  },
  pressableWrapper: { padding: 15, borderRadius, justifyContent: "space-between" },
  text: { fontSize: 20 },
});
