import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    marginHorizontal: 5,
    padding: 10,
    borderRadius,
  },
  setDisplayStyle: {
    textAlign: "center",
    alignSelf: "stretch",
    fontSize: 16,
    flex: 0.85,
  },
  set: { textAlign: "center", flex: 1, fontSize: 16 },
});
