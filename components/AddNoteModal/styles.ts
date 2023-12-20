import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    wrapper: { borderRadius, gap: 15, padding: 10, margin: 10 },
    buttonWrapper: { justifyContent: "flex-end" },
    button: { alignItems: "center", marginVertical: 20, marginHorizontal: 10 },
    input: { padding: 10, borderRadius, width: "100%", flex: 1, flexWrap: "wrap", height: "100%" },
    buttonText: {
        fontSize: 20,
    },
});
