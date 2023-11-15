import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  wrapper: { borderRadius, gap: 15 },
  textInput: { height: 140, padding: 10, borderRadius },
  stack: { justifyContent: "flex-end" },
  pressable: {
    width: 100,
    padding: 10,
    justifyContent: "center",
  },
});
