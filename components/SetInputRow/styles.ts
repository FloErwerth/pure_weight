import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    inputStack: { gap: 10 },
    numberCenter: { flex: 0.2, height: 50 },
    center: { flex: 1, height: 50 },
    textNumber: { padding: 10, fontSize: 16 },
    textInput: {
        padding: 10,
        alignSelf: "stretch",
        borderRadius,
        fontSize: 16,
    },
    button: { width: 40, padding: 7, borderRadius, alignSelf: "center" },
    set: {
        alignSelf: "center",
    },
    buttonIcon: {
        pointerEvents: "none",
        position: "relative",
        left: -3,
        top: 3,
        height: 30,
    },
    confirmButton: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: 40,
    },
});
