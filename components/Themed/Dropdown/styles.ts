import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 0.6,
    marginRight: 10,
  },
  item: {
    padding: 10,
    textAlign: "center",
    alignItems: "center",
    fontSize: 20,
  },
  dropdown: {
    position: "absolute",
  },
  selectedItem: {
    fontSize: 22,
  },
  selectedItemWrapper: {
    padding: 10,
    borderWidth: 1,
    borderRadius,
    justifyContent: "center",
    alignItems: "center",
  },
});
