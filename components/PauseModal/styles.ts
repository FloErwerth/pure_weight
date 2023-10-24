import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    backgroundColor: "white",
    borderRadius,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  clockWrapper: {
    padding: 20,
  },
  clock: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
