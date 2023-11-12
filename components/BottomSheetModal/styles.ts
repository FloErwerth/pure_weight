import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  wrapper: { justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, paddingLeft: 10, padding: 0, margin: 0 },
  buttonStyle: { padding: 10, borderRadius },
  defaultContentStyle: { borderRadius, padding: 10 },
});
