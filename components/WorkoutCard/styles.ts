import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  animatedWrapper: {
    zIndex: 1,
  },
  iconContainer: {
    position: "absolute",
    borderRadius,
  },
  innerIconContainer: {
    justifyContent: "center",
  },
  diffWrapper: {
    flex: 1,
    gap: 7,
    alignItems: "center",
  },
  hint: {
    fontSize: 11,
  },
  text: {
    fontSize: 13,
    paddingRight: 40,
  },
  progressWrapper: {
    padding: 10,
    borderRadius,
  },
  wrapper: {
    borderRadius,
    gap: 10,
    marginBottom: 10,
    padding: 10,
  },
});
