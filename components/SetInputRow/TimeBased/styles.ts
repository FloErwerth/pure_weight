import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    inputStack: { justifyContent: "space-between", gap: 10, height: 60 },
    numberCenter: { flex: 0.2, height: 50 },
    textNumber: { padding: 10, fontSize: 16 },
    textInput: {
        margin: 5,
        alignSelf: "stretch",
        justifyContent: "center",
        fontSize: 16,
        height: 50,
    },
    controlsWrapper: {
        gap: 5,
        height: 60,
        marginRight: 10,
        alignContent: "center",
        justifyContent: "center",
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
