import { StyleSheet } from "react-native";
import { componentBackgroundColor, mainColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerWrapperChildren: {
    gap: 20,
  },
  title: {
    fontSize: 24,
    color: mainColor,
    paddingVertical: 2.5,
    paddingHorizontal: 5,
  },
  outerWrapper: {
    backgroundColor: componentBackgroundColor,
    padding: 10,
    borderRadius,
    alignSelf: "stretch",
  },
});
