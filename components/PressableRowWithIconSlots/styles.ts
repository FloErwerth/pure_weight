import { StyleSheet } from "react-native";
import { componentBackgroundColor, mainColor } from "../App/theme/colors";
import { borderRadius } from "../App/theme/border";

export const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: mainColor,
  },
  singleButton: {
    flex: 1,
  },
  noIconWrapper: {
    paddingVertical: 12.5,
  },
  innerWrapper: {
    padding: 10,
    paddingLeft: 16,
    paddingRight: 0,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: componentBackgroundColor,
    borderRadius,
    alignSelf: "stretch",
  },
  iconWrapper: {
    justifyContent: "flex-end",
    gap: 10,
    paddingRight: 16,
  },
  icon: {
    padding: 5,
  },
  iconCorrection: {
    left: -12.5,
    top: -12.5,
  },
});
