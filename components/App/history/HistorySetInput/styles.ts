import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        alignItems: "center",
        borderRadius,
    },
    inputStack: { gap: 10 },
    center: { flex: 1, height: 50 },
    numberCenter: { flex: 0.2, height: 50 },
    textInput: {
        borderRadius,
    },
    set: {
        alignSelf: "center",
    },
    box: {
        width: 40,
    },
    text: { paddingLeft: 20, fontSize: 16, marginTop: 3 },
});
