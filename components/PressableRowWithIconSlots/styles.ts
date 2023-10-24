import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  singleButton: {
    flex: 1,
  },
  noIconWrapper: {
    paddingVertical: 12.5,
  },
  innerWrapper: {
    padding: 10,
    flexDirection: "row",
    paddingLeft: 16,
    paddingRight: 0,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius,
    alignSelf: "stretch",
  },
  iconWrapper: {
    justifyContent: "flex-end",
    gap: 10,
    paddingRight: 16,
    backgroundColor: "transparent",
  },
  icon: {
    padding: 5,
  },
  iconCorrection: {
    left: -12.5,
    top: -12.5,
  },
});
