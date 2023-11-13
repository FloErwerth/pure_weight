import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  wrapper: { borderRadius, gap: 15 },
  buttonWrapper: { justifyContent: "flex-end" },
  button: { width: 100 },
  input: { height: 140, padding: 10, borderRadius },
});
