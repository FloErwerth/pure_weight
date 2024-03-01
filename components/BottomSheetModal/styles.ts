import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    wrapper: { justifyContent: "center", alignItems: "center" },
    title: { textAlign: "center", fontSize: 30, padding: 0, margin: 0, marginBottom: 10 },
    buttonStyle: { padding: 10, borderRadius },
    defaultContentStyle: { borderRadius, padding: 10 },
});
