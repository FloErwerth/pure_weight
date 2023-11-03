import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    padding: 10,
  },
  animatedWrapper: {
    zIndex: 1,
  },
  iconContainer: {
    width: 200,
    position: "absolute",
    borderRadius,
    justifyContent: "center",
  },
  editIcon: { position: "absolute", left: 15 },
  deleteIcon: { position: "absolute", right: 15 },
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
  },
  progressWrapper: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius,
  },
  wrapper: {
    borderRadius,
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
});
