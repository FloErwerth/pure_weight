import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  wrapper: { justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, padding: 0, margin: 0, marginBottom: 20 },
  buttonStyle: { padding: 10, borderRadius },
  defaultContentStyle: { borderRadius, padding: 10 },
});
