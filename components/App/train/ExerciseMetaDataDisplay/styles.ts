import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
  wrapper: { justifyContent: "space-between", borderRadius, padding: 10, flex: 1 },
  pressable: { width: 50, alignItems: "center", justifyContent: "center" },
});
