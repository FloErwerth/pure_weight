import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    padding: 15,
    alignSelf: "stretch",
    justifyContent: "space-around",
    borderColor: "transparent",
    borderRadius,
    borderWidth: 1,
  },
  vStack: {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  outerStack: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
  },
  innerStack: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  text: {
    fontSize: 20,
  },
});