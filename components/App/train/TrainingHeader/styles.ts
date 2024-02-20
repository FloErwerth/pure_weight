import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        borderRadius,
        marginHorizontal: 5,
        marginTop: 3,
        marginBottom: 10,
    },
    number: {
        flex: 0.2,
        textAlign: "center",
        fontSize: 16,
    },
    durationInput: {
        fontSize: 16,
        flex: 1.9,
        textAlign: "center",
    },
    inputStack: { flex: 1, gap: 12 },
    input: { flex: 1, textAlign: "center", fontSize: 16 },
    placeholder: { flex: 1 },
});
