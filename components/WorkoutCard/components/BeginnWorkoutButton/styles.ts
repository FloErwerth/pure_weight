import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    paddingLeft: 12,
    marginHorizontal: 10,
    borderRadius,
  },
  innerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
  },
  hstack: {
    gap: 10,
  },
});
