import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius,
        padding: 5,
    },
    inputStack: { gap: 10 },
    center: { flex: 1, height: 50 },
    numberCenter: { flex: 0.2, height: 50 },
    textNumber: { padding: 10, fontSize: 16 },
    textInput: {
        alignSelf: "stretch",
        borderRadius,
        fontSize: 16,
    },
    set: {
        alignSelf: "center",
    },
    box: {
        width: 40,
    },
});
