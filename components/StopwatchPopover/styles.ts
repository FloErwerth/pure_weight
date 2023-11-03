import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    borderRadius,
    padding: 20,
    position: "absolute",
    width: Dimensions.get("screen").width,
  },
  hStack: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-evenly",
  },
  buttons: { gap: 20, justifyContent: "center" },
});

export const stopWatchStyles = StyleSheet.create({
  container: { justifyContent: "center" },
  digit: { fontSize: 50, textAlign: "center", alignItems: "center", alignSelf: "center", width: 30 },
});