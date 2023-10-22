import { StyleSheet } from "react-native";
import { borderRadius } from "../App/theme/border";

export const styles = StyleSheet.create({
  stack: {
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius,
    marginHorizontal: 5,
  },
  set: {
    alignSelf: "center",
  },
  buttonIcon: {
    pointerEvents: "none",
    position: "relative",
    left: -3,
    top: 3,
    height: 30,
  },
  confirmButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 40,
  },
});
