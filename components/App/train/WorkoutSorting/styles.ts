import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    padding: 10,
    borderRadius,
  },
  title: {
    fontSize: 20,
  },
  option: {
    padding: 10,
    borderRadius,
  },
  optionStack: {
    gap: 10,
  },
  optionText: {
    fontSize: 20,
  },
  optionWrapper: {
    padding: 10,
    gap: 10,
  },
});
