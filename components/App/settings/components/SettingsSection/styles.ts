import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../../theme/border";

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
    paddingVertical: 2.5,
    paddingHorizontal: 5,
  },
  outerWrapper: {
    padding: 10,
    borderRadius,
    alignSelf: "stretch",
  },
});
